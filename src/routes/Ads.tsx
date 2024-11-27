import { FormEvent, useEffect, useState } from "react";
import { scrapeBookForAdsKeywords, scrapeListForAdsKeywords } from "../utils/book-scraping";
import { getStorage } from "../adapters/storage";
import { Signal, signal } from "@preact/signals";
import { getType } from "../utils/list-parsing/get-type";
import getAsinFromUrl from "../utils/get-asin-from-url";
import AdsFilterDisplayKeywords from "../components/AdsFilterDisplayKeywords";
import { Search } from "../types/book-ads";

export const adsSearches: Signal<Array<Search>> = signal([])

function Ads() {
  const [searches, setSearches] = useState<Array<Search>>(adsSearches.value);
  const pageType = getType(window.location.href);
  const scrapablePageTypes = ['product', 'digitalBestseller', 'physicalBestseller', 'search'];
  const isScrapable = scrapablePageTypes.includes(pageType);

  // TODO - save searches to storage
  useEffect(() => {
    adsSearches.subscribe((searches) => setSearches(searches))

    getStorage(['adsSearches']).then(storage => {
      if (storage?.adsSearches) {
        adsSearches.value = JSON.parse(storage.adsSearches)
      }
    })
  }, [])


  const [newAsin, setNewAsin] = useState<string>('');

  const collectKeywordsForAsin = (event: FormEvent<HTMLFormElement>): void  => {
    event.preventDefault();
    scrapeBookForAdsKeywords(newAsin)
  }

  const scrapePageForAdsKeywords = () => {
    if(pageType == 'product') {
      const asin = getAsinFromUrl(window.location.href) as string;
      scrapeBookForAdsKeywords(asin)
    } else {
      scrapeListForAdsKeywords()
    }
  }

  return (
    <div className="py-2">
      {/* TODO - add spinner to buttons when working */}
      <div className="flex flex-row justify-between items-center border-b border-black mb-2 pb-1">
        {/* TODO - disable when not on a scrapable page */}
        <button
          className="border border-gray-200 bg-blue-500 text-white px-2 py-1 rounded-sm disabled:opacity-50"
          onClick={scrapePageForAdsKeywords}
          disabled={!isScrapable}
        >
          Find keywords on this page
        </button>
        <div>or</div>
        <div>
          <form className="flex flex-row gap-2 w-full" onSubmit={collectKeywordsForAsin}>
            <input
              type="text"
              className="border border-black w-64 p-1"
              placeholder="Scrape by ASIN"
              value={newAsin}
              onChange={(e) => setNewAsin(e.target.value)}
            />
            <button
              type="submit"
              className="border border-gray-200 bg-blue-500 text-white px-2 py-1 rounded-sm disabled:opacity-50"
              disabled={!newAsin}
            >
              Scrape
            </button>
          </form>
        </div>
      </div>
      <AdsFilterDisplayKeywords searches={searches} />
    </div>
  )
}

export default Ads;