import { SalesCategory } from "./book-rank-item";

export type Filter = 'title' | 'authors' | 'asin' | 'category';
export type Keyword = {kind: Filter, keyword: string}
export type Search = {
  id: string,
  name: string,
  status: 'loading' | 'complete' | 'error' | 'interrupted',
  keywords: Array<Keyword>,
}
export type CarouselItem = {
  title: string,
  asin: string,
  authors?: string[]
}
export type ParsedAdsBook = {
  title: string;
  asin: string;
  authors?: string[];
  salesCategories: SalesCategory[];
  carouselItems?: Array<CarouselItem>;
}