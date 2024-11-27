import clsx from "clsx"
import BookRankItem from "../types/book-rank-item"
import { latestDataFor, untrackBook } from "../utils/book-tracking"
import { numDatesTracked } from "../utils/ranking-calculations"

export function RankIndexTable({books, gotoBook }: {
  books: BookRankItem[],
  gotoBook: (book: BookRankItem) => void
}) {
  return (
    <div className="text-xs overflow-y-auto max-h-[500px]">
      <div className="font-bold leading-3 flex bg-gray-100 items-center p-1 sticky top-0">
        <div className="text-center w-4">#</div>
        <div className="w-3/5">Book Title</div>
        <div className="w-2/5 flex flex-row items-center">
          <div className="text-center w-1/4">Format</div>
          <div className="text-center w-1/4">Sales Rank</div>
          <div className="text-center w-1/4">Days Tracked</div>
          <div className="text-center w-1/4">Options</div>
        </div>
      </div>
      {books.filter(b => b.isTracked).map((book, index) => (
        <div key={book.asin} className={clsx("flex p-1", index % 2 == 1 ? 'bg-gray-200' : 'bg-gray-300')}>
          <div className="text-center w-4">{index + 1}</div>
          <div className="w-3/5">
            <button
              onClick={() => gotoBook(book)}
              className="hover:underline text-left"
            >
              {book.title}
            </button>
          </div>
          <div className="w-2/5 flex flex-row">
            <div className="text-center w-1/4">{book.format}</div>
            <div className="text-center w-1/4">{latestDataFor(book).salesRank}</div>
            <div className="text-center w-1/4">
              {numDatesTracked(book)}
            </div>
            <div className="text-center w-1/4 flex justify-center">
              <button
                className="w-4 h-4 border border-black rounded-full hover:bg-red-700 bg-red-600 text-xs text-white flex justify-center items-center"
                style={{fontSize: '8px'}}
                onClick={() => untrackBook(book)}
              >
                U
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}