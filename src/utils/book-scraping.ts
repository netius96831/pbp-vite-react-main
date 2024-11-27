import { updateBookRankData, trackedBooks, currentBook, getTrackedBooks, researchListBooks, researchListBooksIndexData, researchTitle } from "./book-tracking";
import { adsSearches } from "../routes/Ads";
import { BookRankItem, ParsedBook, Book, BookRankData } from "../types/book-rank-item";
import { sendMessage } from "../adapters/send-message";
import { toDatetimeString } from "./to-date-string";
import getAsinFor from "./get-asin-from-url";
import { getStorage, setStorage } from "../adapters/storage";
import parseList from "./parse-list";
import { books } from "../utils/example-book-data";
import { parseAds, parseListItemForAds } from "./parse-ads";
import { getType } from "./list-parsing/get-type";
import { ParsedAdsBook, Search } from "../types/book-ads";

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export function getCurrentAsin(): string | null {
  const url = window.location.href;
  return getAsinFor(url);
}

export async function scrapeCurrentBook() {
  const tracked = await getTrackedBooks()
  trackedBooks.value = tracked

  const asin = await getCurrentAsin()
  if(!asin) return // if not a book page, stop here - we'll be showing the index

  const savedBook = tracked.find(book => book.asin === asin)
  if(savedBook) {
    currentBook.value = savedBook;
    return;
  }

  // if we don't have the book, scrape it.
  sendMessage({ type: 'scrape-book' }, (response) => {
    const { data } = response as { data: ParsedBook }
    const { book, bookRankData } = splitRankData(data)

    const bookRankItem: BookRankItem = {
      ...book,
      isTracked: false,
      rankData: [bookRankData],
    }

    currentBook.value = {...bookRankItem, asin }
  })
}

export async function scrapeResearchListBooks() {
  if(window.location.hostname === 'localhost') {
    researchListBooksIndexData.value = books.map(book => ({asin: book.asin, title: book.title}))
    researchTitle.value = 'Fake List'
  } else {
    const parser = new DOMParser();
    const html = document.documentElement.innerHTML
    const doc = parser.parseFromString(html, 'text/html');

    const { indexData, listName } = parseList(doc)
    researchTitle.value = listName
    researchListBooksIndexData.value = indexData
  }

  researchListBooksIndexData.value.forEach(async ({asin}, index) => {
    await delay(1000 * index * Math.random())
    sendMessage({type: 'background-scrape-tracked-book', url: `https://www.amazon.com/dp/${asin}` }, (response) => {
      const { data } = response as { data: ParsedBook }
      researchListBooks.value = [...researchListBooks.value, data]
    })
  })
}

export async function scrapeListForAdsKeywords() {
  const pageType = getType(window.location.href)
  const adSearch: Search = {
    id: Math.round(Math.random() * 100000000000).toString(),
    name: `${pageType}`,
    status: 'loading',
    keywords: [],
  }
  saveAdSearch(adSearch)

  const parser = new DOMParser();
  const html = document.documentElement.innerHTML
  const doc = parser.parseFromString(html, 'text/html');

  const { indexData, listName } = parseList(doc)

  adSearch.name = listName
  adSearch.keywords = indexData.map((data) => parseListItemForAds(data)).flat()
  updateAdSearch(adSearch)

  const beforeUnload = () => {
    adSearch.status = 'interrupted';
    updateAdSearch(adSearch)
  };
  window.addEventListener('beforeunload', beforeUnload)

  indexData.forEach(async ({asin}, index) => {
    await delay(1000 * index * Math.random())
    sendMessage({type: 'background-scrape-tracked-book', url: `https://www.amazon.com/dp/${asin}`, isAds: true }, (response) => {
      const { data } = response as { data: ParsedAdsBook }
      const keywords = parseAds(data)
      adSearch.keywords = [...adSearch.keywords, ...keywords]
      updateAdSearch(adSearch)
    })
  })

  await delay(1000 * indexData.length)

  adSearch.status = 'complete'
  updateAdSearch(adSearch)

  window.removeEventListener('beforeunload', beforeUnload)
}

function saveAdSearch(adSearch: Search) {
  adsSearches.value = [...adsSearches.value, adSearch]
  setStorage({ adsSearches: JSON.stringify(adsSearches.value) })
}

function updateAdSearch(adSearch: Search) {
  adsSearches.value = adsSearches.value.map(search => search.id === adSearch.id ? adSearch : search)
  setStorage({ adsSearches: JSON.stringify(adsSearches.value) })
}

export async function scrapeBookForAdsKeywords(asin: string) {
  console.log('scraping book for ads keywords')
  const adSearch: Search = {
    id: Math.round(Math.random() * 100000000000).toString(),
    name: `ASIN search: ${asin}`,
    status: 'loading',
    keywords: [],
  }
  saveAdSearch(adSearch)

  sendMessage({type: 'background-scrape-tracked-book', url: `https://www.amazon.com/dp/${asin}`, isAds: true }, (response) => {
    const { data } = response as { data: ParsedAdsBook }
    const keywords = parseAds(data)
    adSearch.keywords = keywords
    adSearch.status = 'complete'

    updateAdSearch(adSearch)
  })
}

export async function scrapeTrackedBooks() {
  if(await alreadyScrapedThisHour()) {
    console.log('Already scraped this hour')
    return
  }

  const tracked = await getTrackedBooks()

  tracked.forEach(book => {
    backgroundScrapeBook(book)
  })
}

function backgroundScrapeBook(book: BookRankItem) {
  const { asin } = book
  sendMessage({type: 'background-scrape-tracked-book', url: `https://www.amazon.com/dp/${asin}` }, (response) => {
    const { data } = response as { data: ParsedBook }
    const { bookRankData } = splitRankData(data)
    const updatedBook = updateBookRankData(asin, bookRankData)
    if(updatedBook) {
      logScrape()
    }
  })
}

function logScrape(): void {
  setStorage({ lastScrape: toDatetimeString(new Date()) })
}

async function alreadyScrapedThisHour(): Promise<boolean> {
  const storage = await getStorage(['lastScrape'])
  const lastScrape = storage?.lastScrape
  if(!lastScrape) return false
  const latestCollectionDatetime = new Date(lastScrape);

  const currentDatetime = new Date();
  const oneHourAgo = new Date(currentDatetime.getTime() - 60 * 60 * 1000);

  return latestCollectionDatetime > oneHourAgo;
}

function splitRankData(data: ParsedBook): {book: Book, bookRankData: BookRankData} {
  const { asin, title, noPages, audioLength, auths, pubDate, cover, salePrice, salesRank, salesCategories, estimatedSales, monthlyRevenue, noReviews, avgStars, format } = data

  const book: Book = {
    asin,
    title,
    noPages,
    audioLength,
    auths,
    pubDate,
    cover,
    salesCategories,
    noReviews,
    avgStars,
    format,
  }

  const bookRankData: BookRankData = {
    salePrice,
    salesRank,
    estimatedSales,
    monthlyRevenue,
    datetimeCollected: toDatetimeString(new Date()),
  }

  return {
    book,
    bookRankData
  }
}