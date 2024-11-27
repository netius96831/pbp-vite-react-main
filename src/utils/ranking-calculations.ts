import BookRankItem, { BookRankData } from "../types/book-rank-item";

function uniqueDates(book: BookRankItem) {
  const dates = book?.rankData.map((data) => data.datetimeCollected.split(' ')[0])
  return dates.filter((date, index, self) => self.indexOf(date) === index)
}

export function numDatesTracked(book: BookRankItem) {
  return uniqueDates(book)?.length || 0
}

function firstRankPerDate(book: BookRankItem): BookRankData[] {
  const dates = uniqueDates(book)
  if(!dates.length) return []

  const firstRankPerDate = dates.map((date) => book?.rankData.find((data) => data.datetimeCollected.split(' ')[0] === date))
  return firstRankPerDate.filter(x => x) as BookRankData[]
}


export function averageMonthlyEarnings(book: BookRankItem) {
  if(!book) return 0

  const ranks = firstRankPerDate(book)
  return ranks.reduce((total, rank) => total + rank.monthlyRevenue, 0) / ranks.length
}

export function averageDailySalesRank(book: BookRankItem) {
  if(!book) return 0

  const ranks = firstRankPerDate(book)
  return ranks.reduce((total, rank) => total + rank.salesRank, 0) / ranks.length
}
