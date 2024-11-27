export type BookListType =  'physicalBestseller' | 'digitalBestseller' | 'search' | 'author' | 'product' | 'unknown' | 'local'

export function digital_bestseller_match(url: string): string {
  const data = url.match(/([^\/?]+)?\/zgbs\/digital-text\/([^\/?]+)?/i) ||
    url.match(/\/bestsellers\/digital-text\/(?:(\d*)\/?)?/i)
  return data ? (data[1] || data[2]) : '';
}

export function physical_bestseller_match(url: string): string {
  const data = url.match(/\/zgbs\/books\/(?:(\d*)\/)?/i) ||
    url.match(/\/bestsellers\/books\/(?:(\d*)\/?)?/i)
  return data ? data[0] : '';
}

export function author_match(url: string): string {
  const data = url.match(/\/author\/([^\/?]+)/i);
  return data ? data[1] : '';
}

export function product_match(url: string): string {
  const data = url.match(/\/dp\/([^\/]+)/i)
    || url.match(/\/gp\/product\/([^\/]+)/i);
  return data ? data[1] : '';
}

export function search_match(url: string): string {
  const data = url.match(/\/s\?k=([^&]+)/i);
  return data ? data[1] : '';
}

export function getType(url: string): BookListType {
  if(url.match(/localhost/)) {
    return 'local'
  } else if(physical_bestseller_match(url)) {
    return 'physicalBestseller'
  } else if (digital_bestseller_match(url)) {
    return 'digitalBestseller'
  } else if (author_match(url)) {
    return 'author'
  } else if (product_match(url)) {
    return 'product'
  } else if (search_match(url)) {
    return 'search'
  } else {
    return 'unknown'
  }
}