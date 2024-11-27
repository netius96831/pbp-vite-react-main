import findAuthorBooks, { findAuthorName } from './list-parsing/find-author-books';
import { findBestsellers } from './list-parsing/find-bestsellers';
import { findSearchResults, findSearchTitle } from './list-parsing/find-search-results';
import { getType } from './list-parsing/get-type';
import { BookIndexData } from '../types/book-rank-item';

export const parseList = (doc: Document): {
  indexData: BookIndexData[],
  listName: string
 } => {
    const listType = getType(window.location.href);

    let indexData: BookIndexData[] = []
    let listName = ''

    if (listType === 'digitalBestseller' || listType === 'physicalBestseller') {
      indexData = findBestsellers(doc);
      const foundListName = doc.querySelector('h1')?.textContent;
      const defaultListName = listType === 'digitalBestseller' ? "Digital Bestellers" : 'Bestsellers'
      listName = foundListName || defaultListName
    } else if(listType === 'search') {
      indexData = findSearchResults(doc);
      const title = findSearchTitle(doc);
      listName = `Search: ${title}`
    } else if(listType === 'author') {
      indexData = findAuthorBooks(/*doc*/);
      const author = findAuthorName(doc)
      listName = `Author: ${author}`
    }
    // The other options -- 'product' and 'unknown' -- are handled before this.

    return {
      indexData,
      listName
    };
};

export default parseList;