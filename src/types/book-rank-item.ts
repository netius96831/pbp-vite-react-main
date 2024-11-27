export type SalesCategory = {
  rank: string;
  ladder: string[];
  link: string;
}

export type Book = {
  asin: string;
  title: string;
  noPages?: number;
  audioLength?: number;
  auths: string[];
  pubDate: string;
  cover: string;
  noReviews: number;
  avgStars: number;
  salesCategories: SalesCategory[];
  notifyWorseRank?: number;
  notifyBetterRank?: number;
  format: string;
}
export type BookRankData = {
  salePrice: number;
  salesRank: number;
  estimatedSales: number;
  monthlyRevenue: number;
  datetimeCollected: string;
}

export type BookRankItem = Book & {
  isTracked?: boolean;
  rankData: BookRankData[];
};

export type ParsedBook = Book & BookRankData;
export type BookList = (ParsedBook & { listRank: number })[];

export type BookIndexData = {
  asin: string,
  title: string,
  authors?: string,
}

export default BookRankItem;