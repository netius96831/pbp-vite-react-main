import clsx from "clsx";

import { downloadCsv } from "../utils/csv/download-csv-ads-keywords";
import { adsSearches } from "../routes/Ads";
import { setStorage } from "../adapters/storage";
import { useState } from "react";
import { Filter, Search } from "../types/book-ads";

import { faCheckCircle, faSpinner, faTrashCan, faTriangleExclamation, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AdsFilterDisplayKeywords = ({searches}: {
  searches: Array<Search>
}) => {

  const [unselectedSearchIds, setUnselectedSearchIds] = useState<string[]>([]);
  const selectedSearches = searches.filter(search => !unselectedSearchIds.includes(search.id));

  const [selectedFilters, setSelectedFilters] = useState<Array<Filter>>(['title', 'authors', 'asin', 'category']);
  const selectedKeywords = selectedSearches.flatMap(search => search.keywords).filter(keyword => selectedFilters.includes(keyword.kind));
  const nonrepeatingKeywords = Array.from(new Set(selectedKeywords.map(keyword => JSON.stringify(keyword)))).map(keyword => JSON.parse(keyword))

  const deleteSelectedSearches = () => {
    adsSearches.value = searches.filter(search => unselectedSearchIds.includes(search.id))
    setStorage({ adsSearches: JSON.stringify(adsSearches.value) })
  }

  const toggleFilter = (filter: Filter) => {
    console.log('toggleFilter', filter, selectedFilters)
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter(f => f !== filter))
    } else {
      setSelectedFilters([...selectedFilters, filter])
    }
  }

  const toggleSelection = (id: string) => {
    if (unselectedSearchIds.includes(id)) {
      setUnselectedSearchIds(unselectedSearchIds.filter(searchId => searchId !== id))
    } else {
      setUnselectedSearchIds([...unselectedSearchIds, id])
    }
  }

  const Checkbox = ({label, filter}: {label: string, filter: Filter}) => (
    <label className="inline-flex items-center mt-1 cursor-pointer text-sm">
      <input
        type="checkbox"
        className="form-checkbox h-5 w-5 text-gray-600"
        checked={selectedFilters.includes(filter)}
        onChange={() => toggleFilter(filter)}
      />
      <span className="ml-2 text-gray-700">{label}</span>
    </label>
  )

  return (
    <div className="flex flex-row gap-2">
      <div className="w-2/5 border-r border-r-black">
        <div className="border-b border-black mb-2 pb-1 h-[300px] overflow-y-auto pr-2">
          {searches.map(search => (
            <div
              key={search.id}
              className={clsx(
                "flex flex-row justify-between items-center cursor-pointer p-1 text-sm",
                unselectedSearchIds.includes(search.id) ? 'bg-white' : 'bg-gray-100 font-bold'
              )}
              onClick={() => toggleSelection(search.id)}
            >
              <div>{search.name}</div>
              {search.status === 'loading' && <FontAwesomeIcon icon={faSpinner} className="text-gray-500 fa-spin slow-spin" />}
              {search.status === 'interrupted' && <FontAwesomeIcon icon={faTriangleExclamation} className="text-yellow-700" />}
              {search.status === 'error' && <FontAwesomeIcon icon={faX} className="text-red-500" />}
              {search.status === 'complete' && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />}
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-between items-center mb-2 pr-2">
          <div>Listings selected: {selectedSearches.length}</div>
          <button
            className="border border-red-100 px-1 py-0.5 rounded-sm disabled:opacity-50 hover:bg-red-50 text-xs flex-nowrap flex items-center"
            onClick={deleteSelectedSearches}
          >
            <div className="pr-1">Delete</div>
            <FontAwesomeIcon icon={faTrashCan} className="text-red-500" />
          </button>
        </div>
        <div className="border-b border-t border-black mb-2 pb-1 pr-2">
          <div className="flex flex-col">
            <div className="font-bold">Filter keywords</div>
            <Checkbox label="Title" filter="title" />
            <Checkbox label="Author" filter="authors" />
            <Checkbox label="ASIN" filter="asin" />
            <Checkbox label="Category" filter="category" />
          </div>
        </div>

        <div className="flex flex-row justify-between items-center">
          <button
            className="border border-gray-200 bg-blue-500 text-white px-2 py-1 rounded-sm disabled:opacity-50"
            onClick={() => downloadCsv(nonrepeatingKeywords)}
            disabled={nonrepeatingKeywords.length === 0}
          >
            Save {nonrepeatingKeywords.length} Keywords
          </button>
        </div>
      </div>
      <div className="w-3/5 h-[515px] overflow-y-auto">
        <div className="">
          {nonrepeatingKeywords.map((keyword, index) => (
            <div
              key={`${keyword.keyword}-${Math.round(Math.random() * 100000)}`}
              className={clsx(
                "flex flex-row justify-between items-center text-sm px-2",
                index % 2 === 0 ? "bg-gray-100" : "bg-white"
              )}
            >
              <div>{keyword.keyword}</div>
              <div>{keyword.kind}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdsFilterDisplayKeywords;