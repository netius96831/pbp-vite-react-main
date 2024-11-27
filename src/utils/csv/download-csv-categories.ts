import { download } from "./download";
import { todaysDate } from "./todays-date"

const csvHeader = 'Count,Category,Link\n'

export const downloadCsv = (categories: [category: string, data: {count: number, link: string}][], name: string) => {
  if(!categories) return;

  const csvData = categories.map(([category, {count, link}]) => {
    return `${count},"${category}",${link}`
  }).join('\n')
  const title = `categories_${name}_${todaysDate()}.csv`
  download([csvHeader, ...csvData], title)
}