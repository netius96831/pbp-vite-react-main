import clsx from "clsx";
import { BookList } from "../types/book-rank-item";
import { downloadCsv } from "../utils/csv/download-csv-categories";


function ResearchCategory({ books, title }: { books: BookList, title: string}) {
  const categories = books.map((book) => book.salesCategories).flat();
  const categoryCount = categories.reduce((acc, category) => {
    const name = category?.ladder[0];
    if(name) {
      acc[name] = acc[name] ? {...acc[name], count: acc[name].count + 1 } : { count: 1, link: category.link };
    }
    return acc;
  }, {} as { [key: string]: { count: number, link: string } });

  const sortedCategories = Object.entries(categoryCount).sort((a, b) => b[1].count - a[1].count);

  return (
    <div>
      <div className="leading-3 flex text-gray-500 items-center py-2 font-normal">
        Categories for {title}
      </div>
      <div className="text-[10px] overflow-y-auto max-h-[400px]">
        <div className="font-bold leading-3 flex bg-gray-100 items-center p-1 sticky top-0">
          <div className="text-center w-10">Count</div>
          <div className="w-full">Category</div>
        </div>
        {sortedCategories.map(([category, {count, link}], index) => (
          <div key={`${Math.random()}-${category}`} className={clsx("flex leading-5", index % 2 == 1 ? 'bg-gray-200' : 'bg-gray-300')}>
            <div className="text-center w-10">{count}</div>
            <div>
              <a href={link} className="hover:underline" target="_blank">
                {category}
              </a></div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between text-xs pt-1 mt-1 border-t border-t-black">
        <div className="flex flex-row gap-2">
          <button
            className="flex justify-center px-2 py-1 rounded-sm bg-sky-200 hover:bg-sky-300"
            onClick={() => downloadCsv(sortedCategories, title)}
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResearchCategory;