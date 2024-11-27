import { BookList } from "../../types/book-rank-item"
import { download } from "./download";
import { todaysDate } from "./todays-date"
import { moneyFormatter, decimalFormatter } from "../number-formatters";

const csvHeader = 'Bestseller position,Book title,Number of pages,Sales Price of the Book,Sales Rank,Estimated Sales,Monthly Revenue,Number of Reviews,Average Stars Rating,Author and other contributors,Date of Publication,Book URL\n'

export const downloadCsv = (books: BookList, name: string) => {
  if(!books) return;

  const csvData = books.map((book) => {
    const salePrice = moneyFormatter(book.salePrice)
    const estimatedSales = decimalFormatter(0,book.estimatedSales)
    const monthlyRevenue = moneyFormatter(book.monthlyRevenue)
    const avgStars = decimalFormatter(1,book.avgStars)
    return `${book.listRank},"${book.title}","${book.noPages}","${salePrice}","${book.salesRank}","${estimatedSales}","${monthlyRevenue}",""${book.noReviews},${avgStars},"${book.auths.join(';')}",${book.pubDate},https://amazon.com/dp/${book.asin}`
  }).join('\n')
  const title = `${name}_${todaysDate()}.csv`
  download([csvHeader, ...csvData], title)
}