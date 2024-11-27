type Options = {[key: string]: any}
import { books } from "../utils/example-book-data";
import getAsinFromUrl from "../utils/get-asin-from-url";

type MessageCallback = (response: Object | undefined) => void;
export const sendMessage = (
  options: Options,
  callback: MessageCallback = () => {}
) => {
  if (typeof chrome.extension === 'undefined') {
    // We're in a webpage context, so return fake data
    fakeBackgroundPromise(options).then((response) => callback(response));
  } else {
    // We're in the extension context
    chrome.runtime.sendMessage(options, (response) => callback(response));
  }
};

// Wait 2 seconds, so we can see the loading spinner
const fakeBackgroundPromise = (options: Options): Promise<Object> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const response = fakeReturnValues(options);
      if (response) { resolve(response); }
      reject();
    }, 2000);
  });
}

// This will mirror the types on `chrome.runtime.onMessage.addListener` in `background.ts`
const fakeReturnValues = (options: Options): Object | void => {
  const { type } = options;
  if (type === 'icon-color') { return {}; }
  if (type === 'login') {
    if(options.provider === 'apex-authors') {
      return {
        email: 'jeffrey@gmail.com',
        tools: ['Research', 'Search', 'Advertising', 'Rank', 'Formatting', 'List', 'PBNify',]
      }
    }
    if (options.provider === 'jay-boyer') {
      return {
        email: 'jb@gmail.com',
        tools: ['Research', 'Advertising', 'PBNify']
      }
    }
    return;
  }

  if (type === 'scrape-book') {
    const url = new URL(window.location.href);
    const asin = url.searchParams.get('dp');
    const book = books.find((book) => book.asin == asin);
    return { data: book };
  }

  if (type === 'background-scrape-tracked-book') {
    const asin = getAsinFromUrl(options.url);
    const book = books.find((book) => book.asin == asin);
    return { data: book };
  }
}



export default sendMessage;