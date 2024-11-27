import { Keyword } from "../../types/book-ads";
import { download } from "./download";
import { todaysDate } from "./todays-date";

const csvHeader = 'Keyword, Kind\n'

export const downloadCsv = (keywords: Array<Keyword>) => {
  if(!keywords) return;

  const csvData = keywords.map((keyword) => {
    return `${keyword.keyword},${keyword.kind}`
  }).join('\n')
  const name = "ads_keywords"
  const title = `${name}_${todaysDate()}.csv`
  download([csvHeader, ...csvData], title)
}