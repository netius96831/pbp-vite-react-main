import { getStorage, setStorage } from "../adapters/storage";
import BookRankItem, { BookIndexData, BookRankData, ParsedBook } from "../types/book-rank-item"
import { Signal, signal } from "@preact/signals"
import { sendNotification } from "../adapters/send-notification";

export const currentBook: Signal<BookRankItem | null> = signal(null)
export const trackedBooks: Signal<BookRankItem[]> = signal([])
export const researchListBooks: Signal<ParsedBook[]> = signal([])
export const researchListBooksIndexData: Signal<BookIndexData[]> = signal([])
export const researchTitle: Signal<string> = signal('')

export async function trackBook(book: BookRankItem) {
  if (!trackedBooks.value.find(b => b.asin === book.asin)) {
    await updateBookStorage({...book, isTracked: true});
    await updateTrackedBooks([...trackedBooks.value, book]);
  }
}

export async function untrackBook(book: BookRankItem) {
  await updateBookStorage({...book, isTracked: false});
  const filteredBooks = trackedBooks.value.filter(b => b.asin !== book.asin);
  await updateTrackedBooks(filteredBooks);
}

export function updateBook(book: BookRankItem) {
  updateBookStorage(book);
  const newTrackedBooks = trackedBooks.value.map(b => b.asin === book.asin ? book : b)
  updateTrackedBooks(newTrackedBooks);
}

export async function getTrackedBooks(): Promise<BookRankItem[]> {
  const storage = await getStorage(['trackedBookAsins']);
  const bookIds = JSON.parse(storage?.trackedBookAsins || '[]');
  const trackedBooks = await Promise.all(bookIds.map(getTrackedBook));
  return trackedBooks.filter(book => !!book);
}

async function getTrackedBook(asin: string): Promise<BookRankItem | undefined> {
  const storage = await getStorage([`trackedBook-${asin}`]) || {};
  const book = JSON.parse(storage[`trackedBook-${asin}`] || 'null');
  return book;
}

export function latestDataFor(book: BookRankItem): BookRankData {
  return book?.rankData.sort((a, b) => {
    return new Date(b.datetimeCollected).getTime() > new Date(a.datetimeCollected).getTime() ? 1 : -1
  })[0]
}

export function updateBookRankData(asin: string, bookRankData: BookRankData) {
  const book = trackedBooks.value.find(book => book.asin === asin)
  if(!book) return;

  let updatedBook: BookRankItem = {
    ...book,
    rankData: [...book.rankData, bookRankData],
  }

  if(book.notifyBetterRank && bookRankData.salesRank < book.notifyBetterRank) {
    sendNotification("Book rank has improved!", `${book.title} is now #${bookRankData.salesRank} in the Kindle Store.`, book.cover)
    updatedBook = {...updatedBook, notifyBetterRank: bookRankData.salesRank - 1};
  }

  if(book.notifyWorseRank && bookRankData.salesRank > book.notifyWorseRank) {
    sendNotification("Book rank has dropped!", `${book.title} is now #${bookRankData.salesRank} in the Kindle Store.`, book.cover)
    updatedBook = {...updatedBook, notifyWorseRank: bookRankData.salesRank + 1};
  }

  updateBook(updatedBook)

  return updatedBook;
}

async function updateTrackedBooks(books: BookRankItem[]) {
  trackedBooks.value = books
  await setStorage({ trackedBookAsins: JSON.stringify(books.map(b => b.asin)) })
}

async function updateBookStorage(book: BookRankItem) {
  await setStorage({ [`trackedBook-${book.asin}`]: JSON.stringify(book) });
}