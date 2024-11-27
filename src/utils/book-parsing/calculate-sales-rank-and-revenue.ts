import { ParsedBook } from "../../types/book-rank-item";

export function calculateSalesRankAndRevenue(bookItem: ParsedBook) {
  const alpha = -0.34034503;
  const beta = -0.07791303;
  const epsilon = 3.98993694;

  const bsr = bookItem['salesRank'];

  let sales = isNaN(bsr) ? 0 : Math.round(Math.pow(10, (epsilon + alpha * Math.log10(bsr) + beta * Math.pow(Math.log10(bsr), 2))) * 15);

  sales = isNaN(sales) ? 0 : sales * .7 ;  ///// 0.7 correction

  bookItem['estimatedSales'] = sales;
  bookItem['monthlyRevenue'] = sales * bookItem['salePrice'];
}