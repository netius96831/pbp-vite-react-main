import openPage from "../adapters/open-page";

export const ResearchBestsellerButtons = () => {
  const css = "px-4 py-0.5 border border-gray-300 mr-0.5 mt-1 bg-gray-300 hover:bg-gray-200"
  return (
    <div className="flex justify-center items-center" style={{height: "500px"}}>
      <div className="flex gap-2">
        <button
          onClick={() => openPage('https://www.amazon.com/best-sellers-books-Amazon/zgbs/books/')}
          className={css}
        >
          Bestsellers
        </button>
        <button
          onClick={() => openPage('https://www.amazon.com/Best-Sellers-Kindle-Store/zgbs/digital-text/')}
          className={css}
        >
          Kindle Bestsellers
        </button>
      </div>
    </div>
  )
}

export default ResearchBestsellerButtons;