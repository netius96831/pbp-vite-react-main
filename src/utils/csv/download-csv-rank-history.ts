import BookRankItem from "../../types/book-rank-item"
import { download } from "./download"
import { todaysDate } from "./todays-date"
import { moneyFormatter, decimalFormatter } from "../number-formatters";

const csvHeader = 'Date,Time,Sales Rank,Price,Reviews,Estimated Sales,Monthly Revenue,ASIN,Title\n'

export async function downloadCsv(book: BookRankItem) {
  if(!book) return
  const csvData = book.rankData.map((data) => {
    const salePrice = moneyFormatter(data.salePrice)
    const estimatedSales = decimalFormatter(0,data.estimatedSales)
    const monthlyRevenue = moneyFormatter(data.monthlyRevenue)
    return `${data.datetimeCollected},"${data.salesRank}","${salePrice}","${book.noReviews}","${estimatedSales}","${monthlyRevenue}",${book.asin},"${book.title}"`
  }).join('\n')
  const title = `salesRank_${book.title}_${todaysDate()}.csv`
  download([csvHeader, ...csvData], title)
}