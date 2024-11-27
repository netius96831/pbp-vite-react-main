import clsx from "clsx";
import { BookList } from "../types/book-rank-item";
import { downloadCsv } from "../utils/csv/download-csv-words-in-title";

const countWords = (books: BookList) => {
  return books
    .flatMap(book => book.title?.toLowerCase().replace(/[^\w\s]|_/g, '').split(' ') || [])
    .reduce<Record<string, number>>((counts, word) => {
      if (word) counts[word] = (counts[word] || 0) + 1;
      return counts;
    }, {});
};

const filterCommonWords = (wordCounts: Record<string, number>) => {
  const commonWords = new Set(['the', 'a', 'an', 'and', 'of', 'in', 'to', 'for', 'with', 'on', 'at', 'from', 'by', 'as', '']);
  return Object.entries(wordCounts).filter(([word]) => !commonWords.has(word));
};

const sortWordsByCount = (wordCounts: [string, number][]) => {
  return wordCounts.sort((a, b) => b[1] - a[1]);
};


function ResearchTitle({ books, title }: { books: BookList, title: string}) {
  const wordCounts = countWords(books);
  const usefulWords = sortWordsByCount(filterCommonWords(wordCounts));

  return (
    <div>
      <div className="leading-3 flex text-gray-500 items-center py-2 font-normal">
        Words in Titles for {title}
      </div>
      <div className="text-[10px] overflow-y-auto max-h-[400px]">
        <div className="font-bold leading-3 flex bg-gray-100 items-center p-1 sticky top-0">
          <div className="text-center w-10">Count</div>
          <div className="w-full">Word</div>
        </div>
        {usefulWords.map(([word, count], index) => (
          <div key={`${Math.random()}-${word}`} className={clsx("flex leading-5", index % 2 == 1 ? 'bg-gray-200' : 'bg-gray-300')}>
            <div className="text-center w-10">{count}</div>
            <div className="w-full">
              {word}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between text-xs pt-1 mt-1 border-t border-t-black">
        <div className="flex flex-row gap-2">
          <button
            className="flex justify-center px-2 py-1 rounded-sm bg-sky-200 hover:bg-sky-300"
            onClick={() => downloadCsv(usefulWords, title)}
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResearchTitle;