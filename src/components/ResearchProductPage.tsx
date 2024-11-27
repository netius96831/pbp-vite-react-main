import { RankTodaysData } from "./RankTodaysData";
import { currentBook } from "../utils/book-tracking";
import BookRankItem from "../types/book-rank-item";
import { useEffect, useState } from "react";
import { scrapeCurrentBook } from "../utils/book-scraping";

export const ResearchProductPage = () => {
  const [ book, setBook ] = useState<BookRankItem | null>(null)

  useEffect(() => {
    currentBook.subscribe((currentBook) => {
      setBook(currentBook)
    })

    scrapeCurrentBook()
  }, [])

  if(!book) return <div className="p-2 flex justify-center">Loading...</div>

  const abbreviatedTitle = book.title.length > 38 ? book.title.substring(0, 38) + '...' : book.title
  return <div className="flex space-x-4 py-2">
    <div className="w-36">
      <img src={book.cover} alt="Book Cover" />
    </div>
    <div>
      <h1 className="text-xl text-gray-500 mt-0 pt-0 leading-5 ">
        {abbreviatedTitle}
      </h1>
      <div className="flex justify-between">
        {book.auths.length > 0 && <div>by {book.auths.join(', ')}</div>}
        {book.format && <div>{book.format} format</div>}
      </div>
      <RankTodaysData book={book} />
    </div>
  </div>
}

export default ResearchProductPage;