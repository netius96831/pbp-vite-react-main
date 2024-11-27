import BookRankItem from "../types/book-rank-item"
import { updateBook } from "../utils/book-tracking";
export function RankNotificationRanges({book, setBook}: {
  book: BookRankItem,
  setBook: (book: BookRankItem) => void,
}) {

  const setBookSafe = (book: BookRankItem) => {
    const isInteger = (value: any) => {
      return value && Number.isInteger(value)
    }
    const safeBetterRank = isInteger(book.notifyBetterRank) ? book.notifyBetterRank : undefined
    const safeWorseRank = isInteger(book.notifyWorseRank) ? book.notifyWorseRank : undefined
    const safeBook = {...book, notifyBetterRank: safeBetterRank, notifyWorseRank: safeWorseRank}
    setBook(safeBook)
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="font-bold">Notify when rank is</div>
      <div className="flex justify-between items-center gap-2">
        Better than
        <input
          type="text"
          autoComplete="off"
          className="border border-gray-300 rounded-sm px-1 py-0.5 w-20"
          value={book.notifyBetterRank}
          onChange={(e) => setBookSafe({...book, notifyBetterRank: parseInt(e.target.value)})}
          onBlur={() => updateBook(book)}
        />
      </div>
      <div className="flex justify-between items-center gap-2">
        Worse than
        <input
          type="text"
          autoComplete="off"
          className="border border-gray-300 rounded-sm px-1 py-0.5 w-20"
          value={book.notifyWorseRank}
          onChange={(e) => setBookSafe({...book, notifyWorseRank: parseInt(e.target.value)})}
          onBlur={() => updateBook(book)}
        />
      </div>
    </div>
  )
}