import { BookIndexData } from "../../types/book-rank-item";

export const findBestsellers = (data: Document): BookIndexData[] => {
  let books = data.querySelectorAll('.zg_itemImmersion .zg_itemWrapper');

  if (!books.length) {
      books = data.querySelectorAll('.zg-item-immersion .zg-item');
  }

  if (!books.length) {
      books = data.querySelectorAll('#gridItemRoot');
  }

  const indexData: BookIndexData[] = []
  books.forEach(book => {
    const link = book.querySelector('a.a-link-normal') as HTMLAnchorElement;
    const authLink = book.querySelector('.a-row.a-size-small .a-link-child') as HTMLAnchorElement;

    const asinData = link?.href.match(/\/dp\/([^\/]*)\//i);
    const asin = asinData ? asinData[1] : null;

    const title = link?.textContent || link.querySelector('img')?.alt || ''
    const authors = authLink?.textContent || ''

    if(asin) indexData.push({asin, title, authors})
  })
  return indexData
}

export default findBestsellers;