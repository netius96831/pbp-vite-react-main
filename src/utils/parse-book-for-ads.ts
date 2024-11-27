import { CarouselItem, ParsedAdsBook } from '../types/book-ads';
import { findAuthors } from './book-parsing/find-authors';
import { findSalesCategories } from './book-parsing/find-sales-categories';
import { findTitle } from './book-parsing/find-title';

export const parseBookForAds = (data: Document, asin: string): ParsedAdsBook => {

  let bookItem: ParsedAdsBook = {
    asin: '',
    title: '',
    salesCategories: [],
    authors: [],
  };

  try {
    if (asin) {
        bookItem['asin'] = asin;
    }

    bookItem['title'] = findTitle(data);
    bookItem['salesCategories'] = findSalesCategories(data);
    bookItem['authors'] = findAuthors(data);


    const carouselItems: CarouselItem[] = []

    const carousels = []
    const relatedOne = data.querySelector('#sp_detail')
    if(relatedOne) carousels.push(relatedOne)
    const relatedTwo = data.querySelector('#sp_detail2')
    if(relatedTwo) carousels.push(relatedTwo)
    const relatedTwoPrime = data.querySelector('#sp_detail2-prime')
    if(relatedTwoPrime) carousels.push(relatedTwoPrime)

    carousels.forEach(carousel => {
      carousel.querySelectorAll('.a-carousel-card').forEach(card => {
        const link = card.querySelector('a.a-link-normal') as HTMLAnchorElement;
        const authLink = card.querySelector('.a-row.a-size-small .a-link-child') as HTMLAnchorElement;

        const asinData = link?.href.match(/\/dp\/([^\/]*)\//i);
        const asin = asinData ? asinData[1] : null;

        const title = link?.textContent || link.querySelector('img')?.alt || ''
        const authors = authLink?.textContent || ''

        console.log({title, asin, authors})

        if(title && asin) {
          carouselItems.push({title, asin, authors: authors?.split(', ')})
        }

      })
    })
    bookItem['carouselItems'] = carouselItems
  } catch (error) {
    console.error(error)
  }


  return bookItem;
}

export default parseBookForAds;
