import { useState } from "react";
import BookRankItem from "../types/book-rank-item"
import { trackBook, untrackBook } from "../utils/book-tracking";
import clsx from "clsx";

export function RankTrackButton({book, setBook}: {
  book: BookRankItem,
  setBook: (book: BookRankItem) => void
}) {
  const [disabled, setDisabled] = useState(false)

  async function track() {
    if(disabled) return
    if(!book) return

    try {
      setDisabled(true)
      await new Promise(resolve => setTimeout(resolve, 500));

      const newBook = {...book, isTracked: true}
      setBook(newBook)
      trackBook(newBook)
    } finally {
      setDisabled(false)
    }
  }

  async function untrack() {
    if(disabled) return
    if(!book) return

    try {
      setDisabled(true)
      await new Promise(resolve => setTimeout(resolve, 500));
      const newBook = {...book, isTracked: false}
      setBook(newBook)
      untrackBook(newBook)
    } finally {
      setDisabled(false)
    }
  }

  return <>
    {book.isTracked ? (
      <button
        className={clsx("px-8 py-2 border border-black rounded-sm text-sm", disabled ? "bg-gray-400" : "bg-red-600 hover:bg-red-700 text-white")}
        onClick={() => untrack()}
        disabled={disabled}
      >
        Untrack
      </button>
    ) : (
      <button
        className={clsx("px-8 py-2 border border-black rounded-sm text-sm", disabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white")}
        onClick={() => track()}
        disabled={disabled}
      >
        Track
      </button>
    )}
  </>
}