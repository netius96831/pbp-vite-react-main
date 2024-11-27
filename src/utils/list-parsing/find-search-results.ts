import { BookIndexData } from "../../types/book-rank-item";

const sponsorLabel = '.puis-sponsored-label-text';

export const findSearchResults = (data: Document): BookIndexData[] => {
  const items = data.querySelectorAll('.s-result-item.s-asin');
  const indexData: BookIndexData[] = []
  items.forEach(item => {
    if(item?.querySelector(sponsorLabel)) {
      // skip sponsored items
    } else {
      const asin = item?.getAttribute('data-asin');
      const title = item?.querySelector('h2')?.textContent || ''
      const authors = item?.querySelector('.a-row .a-size-base.s-underline-text')?.textContent || ''
      if(asin) indexData.push({asin, title, authors})

    }
  })

  return indexData;
}

export const findSearchTitle = (data: Document): string => {
  const search = data.querySelector('#twotabsearchtextbox') as HTMLInputElement;
  return search?.value.trim() || ''
}

export default findSearchResults;
