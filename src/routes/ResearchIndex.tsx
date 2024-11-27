import clsx from "clsx";

import { dollarFormatter, moneyFormatter, decimalFormatter } from "../utils/number-formatters";
import { downloadCsv } from "../utils/csv/download-csv-list";
import { BookList } from "../types/book-rank-item";
import { audioLengthDisplay } from "../utils/audio-length-display";

const SummaryStat = ({ title, result }: { title: string, result: string | number}) => (
  <div className="flex flex-col items-center justify-center">
    <div className="text-center">{title}</div>
    <div className="font-semibold text-sm">{result}</div>
  </div>
)

const sum = (arr: number[]) => arr.reduce((p, c) => p + c, 0);
const average = (arr: number[]) => sum(arr) / arr.length;
const abbreviateTitle = (title: string) => title?.length > 38 ? title.substring(0, 52) + '...' : title

function ResearchIndex({ books, title }: { books: BookList, title: string}) {
  const booksWithRankings = books.filter(b => b.format != 'Audiobook');
  return (
    <div>
      <div className="leading-3 flex text-gray-500 items-center py-2 font-normal">
        {title}
      </div>
      {books.length == 0 ? <div>Loading...</div> : <>
        <div className="bg-blue-100 p-2 w-full text-xs flex justify-between items-center gap-1">
          <SummaryStat title="Results" result={`1 - ${books.length}`} />
          <SummaryStat title="Avg. Sales Rank" result={decimalFormatter(0, average(booksWithRankings.map(b => b.salesRank)))} />
          <SummaryStat title="Avg. Monthly Revenue" result={moneyFormatter(average(booksWithRankings.map(b => b.monthlyRevenue)))} />
          <SummaryStat title="Total Monthly Revenue" result={moneyFormatter(sum(booksWithRankings.map(b => b.monthlyRevenue)))} />
          <SummaryStat title="Avg. Sales Price" result={moneyFormatter(average(books.map(b => b.salePrice)))} />
          <SummaryStat title="Avg. No. Reviews" result={decimalFormatter(0, average(books.map(b => b.noReviews)))} />
        </div>
        <div className="text-[10px] overflow-y-auto max-h-[400px]">
          <div className="font-bold leading-3 flex bg-gray-100 items-center p-1 sticky top-0">
            <div className="text-center w-5">#</div>
            <div className="w-1/2">Book Title</div>
            <div className="w-1/2 flex flex-row items-center space-x-1">
              <div className="text-center w-1/6">Pages</div>
              <div className="text-center w-1/6">Price</div>
              <div className="text-center w-1/6">Rank</div>
              <div className="text-center w-1/6">Est. Sales</div>
              <div className="text-center w-1/6">$/mo</div>
              <div className="text-center w-1/6"># Reviews</div>
            </div>
          </div>
          {books.map((book, index) => (
            <div key={`${Math.random()}-${book.asin}`} className={clsx("flex leading-5", index % 2 == 1 ? 'bg-gray-200' : 'bg-gray-300')}>
              <div className="text-center w-5">{book.listRank}</div>
              <div className="w-1/2">
                {abbreviateTitle(book.title)}
              </div>
              <div className="w-1/2 flex flex-row">
                {book.format == 'Audiobook' ? <>
                  <div className="text-center w-1/6">{audioLengthDisplay(book.audioLength, 'short')}</div>
                  <div className="text-center w-1/6">{moneyFormatter(book.salePrice)}</div>
                  <div className="text-center w-1/6">n/a</div>
                  <div className="text-center w-1/6">n/a</div>
                  <div className="text-center w-1/6">n/a</div>
                  <div className="text-center w-1/6">{decimalFormatter(0, book.noReviews)}</div>
                </> : <>
                  <div className="text-center w-1/6">{book.format == 'Audiobook' ? audioLengthDisplay(book.audioLength, 'short') : book.noPages}</div>
                  <div className="text-center w-1/6">{moneyFormatter(book.salePrice)}</div>
                  <div className="text-center w-1/6">{book.salesRank}</div>
                  <div className="text-center w-1/6">{decimalFormatter(1, book.estimatedSales)}</div>
                  <div className="text-center w-1/6">{dollarFormatter(book.monthlyRevenue)}</div>
                  <div className="text-center w-1/6">{decimalFormatter(0, book.noReviews)}</div>
                </>}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-between text-xs pt-1 mt-1 border-t border-t-black">
          <div className="flex flex-row gap-2">
            <button
              className="flex justify-center px-2 py-1 rounded-sm bg-sky-200 hover:bg-sky-300"
              onClick={() => downloadCsv(books, title)}
            >
              Download CSV
            </button>
          </div>
        </div>
      </>}
    </div>
  )
}

export default ResearchIndex;