import { download } from "./download";
import { todaysDate } from "./todays-date"

const csvHeader = 'Count,Word\n'

export const downloadCsv = (wordCounts: [word: string, count: number][], name: string) => {
  if(!wordCounts) return;

  const csvData = wordCounts.map(([word, count]) => {
    return `${count},${word}`
  }).join('\n')
  const title = `wordcount_${name}_${todaysDate()}.csv`
  download([csvHeader, ...csvData], title)
}