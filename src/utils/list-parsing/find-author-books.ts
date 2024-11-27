import { BookIndexData } from "../../types/book-rank-item";
import getAsinFromUrl from "../get-asin-from-url";

export const findAuthorBooks = (/*data: Document */): BookIndexData[] => {
  // For some reason, passing in data like normal doesn't work... we have to use document
  const books = document.querySelectorAll('[data-testid="product-grid-container"] li')

  console.log("books", books)
  const indexData: BookIndexData[] = []
  books.forEach(book => {
    const link = book.querySelector('a') as HTMLAnchorElement;
    const asin = getAsinFromUrl(link?.href)
    const title = book.querySelector('[data-testid="product-grid-title"]')?.textContent || ''
    if(asin) indexData.push({asin, title})
  })
  return indexData;
}

export const findAuthorName = (data: Document): string => {
  // above tabs
  let authorData = data.querySelector('[itemprop="name"]') as HTMLElement
  if(!authorData) {
    // in header
    authorData = data.querySelector('[data-widgettype="AuthorSubHeader"]') as HTMLElement
  }
  return authorData?.innerText.trim() || ''
}

export default findAuthorBooks;