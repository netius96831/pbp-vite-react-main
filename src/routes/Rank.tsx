// IF on Amazon book page, show that book's rank
// ELSE show the current tracked books

import { useEffect, useState } from "react";

import BookRankItem from "../types/book-rank-item";
import { currentBook, trackedBooks } from "../utils/book-tracking";
import { getCurrentAsin } from "../utils/book-scraping";
import { RankIndexTable } from "../components/RankIndexTable";
import { scrapeTrackedBooks } from '../utils/book-scraping';
import { RankDetailsPage } from "../components/RankDetailsPage";
import { getStorage } from "../adapters/storage";
import { toDatetimeString } from "../utils/to-date-string";

function Rank() {
  const [book, setBook] = useState<BookRankItem | null>(null)
  const [books, setBooks] = useState<BookRankItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewIndex, setViewIndex] = useState(false)
  const [lastScrapedAt, setLastScrapedAt] = useState<Date | null>(null)
  const asin = getCurrentAsin()

  useEffect(() => {
    scrapeTrackedBooks()

    currentBook.subscribe((currentBook) => {
      if(currentBook) {
        setBook(currentBook)
        setViewIndex(false)
        setIsLoading(false)
      } else if(!asin) {
        setViewIndex(true)
      }
    })
    trackedBooks.subscribe((trackedBooks) => {
      setBooks(trackedBooks)
      getStorage(['lastScrape']).then((result) => {
        if(result?.lastScrape) {
          setLastScrapedAt(new Date(result.lastScrape))
        }
      })
    })
  }, [])

  function gotoBook(book: BookRankItem) {
    currentBook.value = book
    setViewIndex(false)
  }

  // TODO - make the book rank page look nice
  return (
    <div className="py-4">
      {viewIndex ? <div>
        {books.length > 0 ? <>
          <div className="flex flex-row justify-between items-center pb-2">
            <div className="text-sm">
              Last updated rankings on { lastScrapedAt && toDatetimeString(lastScrapedAt)}
            </div>

            {asin && <button
              className="px-2 py-1 rounded-sm hover:bg-gray-100 text-sm"
              onClick={() => setViewIndex(false)}
            >
              View book details →
            </button>}
          </div>
          <RankIndexTable books={books} gotoBook={gotoBook} />
        </> : (
          <div>
            You aren't tracking any books yet.  Go to the Amazon page of a book you want to track and click the Track button.
          </div>
        )}
      </div> : <>
        <RankDetailsPage isLoading={isLoading} book={book} asin={asin} setViewIndex={setViewIndex} setBook={setBook} />
      </>}
    </div>
  );
}

export default Rank;