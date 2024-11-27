import { download } from "./download";
import { todaysDate } from "./todays-date"
import { SavedSearch } from "../../routes/Search";

const csvHeader = 'Search Rank, Suggestion, Search Term\n'

export const downloadCsv = (searchResults: Array<SavedSearch>) => {
  if(!searchResults) return;

  const csvData = searchResults.map((result) => {
    return `${result.rank},"${result.suggestion}","${result.search}"`
  }).join('\n')
  const name = "search_suggestions"
  const title = `${name}_${todaysDate()}.csv`
  download([csvHeader, ...csvData], title)
}