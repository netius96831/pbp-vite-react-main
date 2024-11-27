import { moneyFormatter } from "../utils/number-formatters"
import { latestDataFor } from "../utils/book-tracking";
import BookRankItem from "../types/book-rank-item";
import { downloadCsv } from "../utils/csv/download-csv-rank-history";
import { audioLengthDisplay } from "../utils/audio-length-display";

export function RankTodaysData({book}: {book: BookRankItem}) {
  const currentLatestData = book ? latestDataFor(book) : null;

  const Field = ({label, value}: {label: string, value?: string | number}) => (
    <div className="flex flex-col">
      <div className="font-bold">{label}</div>
      <div>{value}</div>
    </div>
  )
  const buttonCss = "px-2 py-1 border border-black rounded-lg bg-blue-100 hover:bg-blue-200 text-sm text-center"
  return (
    <div>
      {currentLatestData && <>
        <div className="grid gap-4 items-start w-full pt-2 grid-cols-3">
          {book.format == 'Audiobook' ? <>
            <Field label="Price" value={moneyFormatter(currentLatestData?.salePrice)} />
            <Field label="Audio Length" value={audioLengthDisplay(book.audioLength, 'long')} />
            <Field label="Review Count" value={book.noReviews} />
            <Field label="Sales Rank" value="n/a" />
            <Field label="Est. Sales" value="n/a" />
            <Field label="Monthly Rev." value="n/a" />
          </> : <>
            <Field label="Price" value={moneyFormatter(currentLatestData?.salePrice)} />
            <Field label="Page Count" value={book.noPages} />
            <Field label="Review Count" value={book.noReviews} />
            <Field label="Sales Rank" value={currentLatestData?.salesRank} />
            <Field label="Est. Sales" value={Math.round(currentLatestData?.estimatedSales)} />
            <Field label="Monthly Rev." value={moneyFormatter(currentLatestData?.monthlyRevenue)} />
          </>}
            <a
              className={buttonCss}
              href={`https://www.google.com/search?q=${book.title}`}
              target="_blank"
            >
              Title Search
            </a>
            <a
              className={buttonCss}
              href={`https://lens.google.com/uploadbyurl?url=${book.cover}`}
              target="_blank"
            >
              Cover Search
            </a>
            {book.isTracked && (
              <button
                className={buttonCss}
                onClick={() => downloadCsv(book)}
              >
                Download CSV
              </button>
            )}
        </div>
      </>}
    </div>
  )
}