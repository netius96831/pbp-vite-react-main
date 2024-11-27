import { useEffect, useState } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { setStorage, getStorage } from "../adapters/storage";
import { downloadCsv } from "../utils/csv/download-csv-searches";
import sendMessage from "../adapters/send-message";

export type SavedSearch = {
  search: string;
  suggestion: string;
  rank: number;
}

function Search() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<Array<SavedSearch>>([])

  useEffect(() => {
    getStorage(['savedSearches']).then(response => {
      setSavedSearches(response?.savedSearches || [])
      if(response?.savedSearches && search === '') {
        selectSearch(response.savedSearches[0].search, response.savedSearches)
      }
    })
  }, [])

  const startSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      getSearchSuggestions(search);
    } finally {
      setIsLoading(false);
    }
  }

  const savedSearchTerms = Array.from(new Set(savedSearches.map(search => search.search)))
  console.log(savedSearchTerms)

  const saveSearchResults = (searchTerm: string, suggestions: string[]) => {
    setSearchSuggestions(suggestions)
    const newSavedSearches: Array<SavedSearch> = []
    suggestions.forEach((suggestion, index) => {
      newSavedSearches.push({search: searchTerm, suggestion, rank: index + 1})
    })
    const combinedSavedSearches = [...newSavedSearches, ...savedSearches]
    setSavedSearches(combinedSavedSearches)
    setStorage({ savedSearches: combinedSavedSearches })
  }

  const clearSearchResults = () => {
    setStorage({savedSearches: []})
    setSavedSearches([])
    setSearch('')
    setSearchSuggestions([])
  }

  const getSearchSuggestions = (searchTerm: string) => {
    const searchBar = document.querySelector('.nav-search-field input') as HTMLInputElement
    const previousValue = searchBar.value;
    searchBar.value = searchTerm;
    searchBar.focus();

    // Wait for the search suggestions to appear.  If it's not getting it for some users, may need to increase the timeout or set specifically to wait for elements.
    setTimeout(() => {
      const suggestions: string[] = []
      const elements = document.querySelectorAll('.autocomplete-results-container .s-suggestion') as NodeListOf<HTMLDivElement>
      elements.forEach(el => suggestions.push(el.innerText))
      saveSearchResults(searchTerm, suggestions)

      // Reset the search bar, including closing it by clicking outside
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      document.body.dispatchEvent(clickEvent);
      searchBar.value = previousValue;
      searchBar.blur();
    }, 500)
  }

  const clickSearchSuggestion = (searchTerm: string) => {
    setSearch(searchTerm);
    getSearchSuggestions(searchTerm);
  }

  const performSearch = (searchTerm: string) => {
    const searchBar = document.querySelector('.nav-search-field input') as HTMLInputElement
    searchBar.value = searchTerm;
    const enterButton = document.querySelector('#nav-search-submit-button') as HTMLInputElement
    enterButton.click();

    navigate('/research')
    sendMessage({type: 'reopen-extension'})
  }

  const selectSearch = (searchTerm: string, savedSearches: Array<SavedSearch>) => {
    setSearch(searchTerm);
    const results = savedSearches.filter(search => search.search === searchTerm)
    setSearchSuggestions(results.map(search => search.suggestion))
  }

  return (
    <div className="py-2">
      <div className="flex flex-row gap-2">
        <div className="w-3/4 border-r border-r-black pr-2 h-[560px] overflow-y-auto">
          <form className="flex flex-row space-x-2 mb-2" onSubmit={startSearch}>
            <input
              type="text"
              placeholder="Search"
              className="px-2 py-1 border border-sky-700 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="border border-sky-700 bg-sky-100 px-2 py-1 rounded-sm whitespace-nowrap">Get Suggestions</button>
          </form>

          {isLoading && <div>Loading...</div>}

          {searchSuggestions.length > 0 && (
            <div className="overflow-y-auto">
              <div className="font-bold leading-3 flex items-center py-2">
                <div className="w-full">Search Suggestions</div>
              </div>
              <div className="overflow-y-auto h-[440px]">
                {searchSuggestions.map((suggestion, index) => (
                  <div key={`${Math.random()}-${suggestion}`} className={clsx("flex leading-5", index % 2 == 1 ? 'bg-gray-200' : 'bg-gray-300')}>
                    <div className="w-full px-2 py-1 flex justify-between items-center">
                      <div>{suggestion}</div>
                      <div className="flex flex-row gap-2">
                        <button
                          className="border border-sky-700 bg-sky-100 px-2 py-0.5 rounded-sm"
                          onClick={() => clickSearchSuggestion(suggestion)}
                        >
                          Suggestions
                        </button>
                        <button
                          className="border border-sky-700 bg-sky-100 px-2 py-0.5 rounded-sm"
                          onClick={() => performSearch(suggestion)}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-1/4 h-[560px] overflow-y-auto">
          <div>{savedSearches.length} saved results</div>
          <h1 className="font-bold py-2 leading-3">Actions</h1>
          <div className="flex flex-col gap-2">
            <button
              className="flex justify-center px-2 py-1 rounded-sm bg-sky-200 hover:bg-sky-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:pointer-events-none"
              onClick={() => downloadCsv(savedSearches)}
              disabled={savedSearches.length === 0}
            >
              Download CSV
            </button>
            <button
              className="flex justify-center px-2 py-1 rounded-sm bg-sky-200 hover:bg-sky-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:pointer-events-none"
              onClick={clearSearchResults}
              disabled={savedSearches.length === 0}
            >
              Clear Results
            </button>
          </div>
          <h1 className="font-bold pt-4 pb-2 leading-3">Saved Searches</h1>
          <ul>
            {savedSearchTerms.length === 0 && <li>---</li>}
            {savedSearchTerms.map(term => (
              <li key={term} className="cursor-pointer" onClick={() => selectSearch(term, savedSearches)}>{term}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Search;