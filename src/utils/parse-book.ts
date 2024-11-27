// This was mostly copied over from the original extension
// I've made some changes to use document instead of jQuery, and use types
// I've also put the functions in separate files

import { ParsedBook } from '../types/book-rank-item';
import { calculateSalesRankAndRevenue } from './book-parsing/calculate-sales-rank-and-revenue';
import { findAuthors } from './book-parsing/find-authors';
import { findAvgStars } from './book-parsing/find-avg-stars';
import { findCover } from './book-parsing/find-cover';
import { findFormat } from './book-parsing/find-format';
import { findNumReviews } from './book-parsing/find-num-reviews';
import { findPrice } from './book-parsing/find-price';
import { findSalesCategories } from './book-parsing/find-sales-categories';
import { findTitle } from './book-parsing/find-title';
import { parseProductDetails } from './book-parsing/parse-product-details';
import { toDatetimeString } from './to-date-string';

const parseBook = (data: Document, asin: string): ParsedBook => {
  let bookItem: ParsedBook = {
      asin: '',
      title: '',
      noPages: 0,
      salePrice: 0,
      salesRank: 0,
      salesCategories: [],
      estimatedSales: 0,
      monthlyRevenue: 0,
      noReviews: 0,
      avgStars: 0,
      auths: [],
      pubDate: '',
      cover: '',
      format: '',
      datetimeCollected: toDatetimeString(new Date()),
  };

  if (asin) {
      bookItem['asin'] = asin;
  }

  bookItem['title'] = findTitle(data);
  bookItem['salesCategories'] = findSalesCategories(data);
  bookItem['salePrice'] = findPrice(data);
  parseProductDetails(data, bookItem)
  calculateSalesRankAndRevenue(bookItem);
  bookItem['noReviews'] = findNumReviews(data) || 0;
  bookItem['auths'] = findAuthors(data);
  bookItem['cover'] = findCover(data)
  bookItem['avgStars'] = findAvgStars(data) || 0;
  bookItem['format'] = findFormat(data) || '';

  return bookItem;
}

export default parseBook;