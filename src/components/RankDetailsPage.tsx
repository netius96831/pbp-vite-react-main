import { RankChart } from "../components/RankChart";
import { RankNotificationRanges } from "../components/RankNotificationRanges";
import { RankTodaysData } from "../components/RankTodaysData";
import { RankTrackButton } from "../components/RankTrackButton";
import BookRankItem from "../types/book-rank-item";
import { moneyFormatter } from "../utils/number-formatters";
import { numDatesTracked, averageMonthlyEarnings, averageDailySalesRank } from "../utils/ranking-calculations";


export function RankDetailsPage({isLoading, book, asin, setViewIndex, setBook}: {
  isLoading: boolean,
  book: BookRankItem | null,
  asin: string | null,
  setViewIndex: (viewIndex: boolean) => void,
  setBook: (book: BookRankItem) => void,
}) {
  const abbreviatedTitle = book ? book.title.length > 38 ? book.title.substring(0, 38) + '...' : book.title : ''
  return <>
    {isLoading || !book ? <div className="text-center">Loading Data for ASIN {asin}...</div> : (
      <div className="space-y-8">
        <div className="flex flex-row justify-between">
          <button onClick={() => setViewIndex(true)}>
          ← All tracked books
          </button>
          <RankTrackButton book={book} setBook={setBook} />
        </div>
        <div className="flex space-x-4">
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
        {book.isTracked && (
          <div className="flex flex-row justify-between text-xs">
            <div className="space-y-4">
              <div className="text-gray-700">
                {numDatesTracked(book)} days tracked<br/>
                {moneyFormatter(averageMonthlyEarnings(book) / 30)} average daily earnings<br/>
                {Math.round(averageDailySalesRank(book))} average daily sales rank
              </div>
              <RankNotificationRanges book={book} setBook={setBook} />
            </div>
            <div className="flex-1">
              {book.isTracked && <RankChart rankData={book.rankData} />}
            </div>
          </div>
        )}
      </div>
    )}
  </>
}