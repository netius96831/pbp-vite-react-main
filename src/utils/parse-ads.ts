import { Keyword, ParsedAdsBook } from "../types/book-ads";

// TODO - make sure we're matching spec with this
export const parseAds = ({title, authors, salesCategories, asin, carouselItems}: ParsedAdsBook): Keyword[] => {
  const keywords: Array<Keyword> = []
  keywords.push({kind: 'asin', keyword: asin})
  salesCategories.forEach(cat => {
    processKeyword({kind: 'category', keyword: cat.ladder[0]}).forEach(kw => keywords.push(kw))
  })
  processKeyword({kind: 'title', keyword: title}).forEach(kw => keywords.push(kw))
  processAuthors(authors).forEach(auth => keywords.push(auth))

  if(carouselItems) {
    carouselItems.forEach(item => {
      processKeyword({kind: 'title', keyword: item.title}).forEach(kw => keywords.push(kw))
      processKeyword({kind: 'asin', keyword: item.asin}).forEach(kw => keywords.push(kw))
      processAuthors(item.authors).forEach(auth => keywords.push(auth))
    })
  }
  return keywords;
}

export const parseListItemForAds = ({title, asin, authors}: {title: string, asin: string, authors?: string}): Keyword[] => {
  const keywords: Array<Keyword> = []
  keywords.push({kind: 'asin', keyword: asin})
  processKeyword({kind: 'title', keyword: title}).forEach(kw => keywords.push(kw))
  processAuthors(authors?.split(',')).forEach(auth => keywords.push(auth))

  return keywords;
}

function processAuthors(authors?: string[]): Keyword[] {
  if(!authors) return []

  return authors.map(author => {
    return processKeyword({kind: 'authors', keyword: author.trim()})
  }).flat()
}
function processKeyword(keyword: Keyword): Keyword[] {
  return [keyword]
    .map(removeSpecialCharacters)
    .flatMap(splitIfTooLong)
    .flatMap(duplicateIfAmpersands)
    .flatMap(specialSplits)
    .filter(({keyword}) => keyword.trim() !== '')
}

function removeSpecialCharacters({keyword, kind}: Keyword): Keyword {
  return { keyword: keyword.replace(/[\(\),.!\#@%\^*:]/g, ''), kind }
}

function splitIfTooLong({keyword, kind}: Keyword): Keyword[] {
  const split = keyword.split(' ');
  if(split.length > 10) {
    const numSplits = Math.ceil(split.length / 10);
    const numPerSplit = Math.ceil(split.length / numSplits);
    const splitKeywords = [];
    for(let i = 0; i < numSplits; i++) {
      splitKeywords.push(split.slice(i * numPerSplit, (i + 1) * numPerSplit).join(' '))
    }
    return splitKeywords.map(keyword => ({keyword, kind}));
  } else {
    return [{keyword, kind}];
  }
}

function duplicateIfAmpersands({keyword, kind}: Keyword): Keyword[] {
  const hasAmpersand = keyword.includes('&');
  if(hasAmpersand) {
    return [
      {keyword: keyword.replace(/&/g, ''), kind },
      {keyword: keyword.replace(/&/g, 'and'), kind },
    ]
  } else {
    return [{keyword, kind}];
  }
}

function specialSplits({keyword, kind}: Keyword): Keyword[] {
  if(kind === 'authors') {
    const split = keyword.split(' ');
    const lastName = split[split.length - 1];
    return [
      {kind, keyword},
      {kind, keyword: lastName}
    ]
  }

  /* The spec says versions of titles with the following changes:
    - volume numbers removed
    - series names removed
    - subtitles removed
    - common english words removed
    It is not clear how to make that split intelligently.
    It's also not clear how they "stack" - with each other, and with the ampersand rule.
    My original scope did not include any scraping/processing changes, so I'm already going way over scope.
    So we're going to push this off to a future milestone.

    Volume numbers and series name might be doable.
    For volume numbers, find anything that says "[book|volume|vol] \d+" and remove it.
    For series names, find the series name where it's listed in the page, and remove it.
    */

  return [{kind, keyword}];
}
