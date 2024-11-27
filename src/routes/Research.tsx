import clsx from "clsx"
import { useEffect, useRef, useState } from "react";
import ResearchIndex from "./ResearchIndex"
import ResearchCategory from "./ResearchCategory"
import ResearchTitle from "./ResearchTitle";

import { getType } from "../utils/list-parsing/get-type"
import ResearchBestsellerButtons from "../components/ResearchBestsellerButtons"
import ResearchProductPage from "../components/ResearchProductPage"
import { BookList, ParsedBook } from "../types/book-rank-item";
import { researchListBooks, researchTitle, researchListBooksIndexData } from "../utils/book-tracking";
import { scrapeResearchListBooks } from "../utils/book-scraping";

type Tab = 'bestseller' | 'category' | 'title'
const tabs = ['bestseller', 'category', 'title'] as Tab[]
function Research() {
  const [tab, setTab] = useState<Tab>('bestseller')
  const pageType = getType(window.location.href)
  const isPage2 = (new URL(window.location.href)).searchParams.get('pg') == '2';


  if(pageType === 'unknown') return <ResearchBestsellerButtons />
  if(pageType === 'product') return <ResearchProductPage />

  const [books, setBooks] = useState<BookList>([]);
  const [title, setTitle] = useState<string>('');
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      scrapeResearchListBooks();
      hasRun.current = true;
    }

    researchListBooks.subscribe((researchListBooks: ParsedBook[]) => {
      const orderedBooks = researchListBooksIndexData.value.map(({asin, title}, index) => {
        return {
          ...(researchListBooks.find(book => book.asin === asin)),
          listRank: isPage2 ? index + 51 : index + 1,
          title: title,
        }
      }).filter(book => book) as BookList;
      setBooks(orderedBooks)
    })
    researchTitle.subscribe((researchTitle) => {
      setTitle(researchTitle)
    })
  }, [])

  return (
    <div>
      <div className="my-2 flex flex-row">
        {tabs.map((t) => (
          <button
            key={t}
            className={clsx(
              "px-4 py-0.5 border border-gray-300 mr-0.5 mt-1",
              tab === t ? 'bg-white border-b-0' : 'bg-gray-300 hover:bg-gray-200'
            )}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <div className="bg-white w-full border-b border-gray-300"></div>
      </div>

      {tab === 'bestseller' && <div>
        <ResearchIndex books={books} title={title} />
      </div>}
      {tab === 'category' && <div>
        <ResearchCategory books={books} title={title} />
      </div>}
      {tab === 'title' && <div>
        <ResearchTitle books={books} title={title} />
      </div>}
    </div>

  )
}

export default Research;