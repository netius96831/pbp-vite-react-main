import { runReactApp } from './run-react-app'
import { createContainer } from './container'
import parseBook from './utils/parse-book';
import getAsinFromUrl from './utils/get-asin-from-url';
import { scrapeTrackedBooks } from './utils/book-scraping';
import { parseBookForAds } from './utils/parse-book-for-ads';

const containerId = 'crx-container'

const attachCss = (path, shadow) => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = chrome.runtime.getURL(path);
  shadow.appendChild(link);
}

const createOnPage = () => {
  const container = createContainer(containerId);
  const shadow = container.shadowRoot;

  if (shadow) {
    const root = document.createElement('div');
    root.id = 'pbp-root';

    attachCss('tailwind.css', shadow);
    attachCss('font-awesome.css', shadow);

    shadow.appendChild(root);

    document.body.appendChild(container);

    runReactApp(root);
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // call createOnPage when extension button is clicked
  if (message.type === 'extensionButtonClicked') {
    const root = document.getElementById(containerId)
    if(!root) {
      createOnPage()
    } else {
      root.remove()
    }
    sendResponse('done')
  }

  if (message.type === 'parse-book-html') {
    console.log("got parse-book-html message", message.isAds)
    const parser = new DOMParser();
    const doc = parser.parseFromString(message.html, 'text/html');
    const asin = getAsinFromUrl(message.url);
    console.log("parsed asin", asin)
    const data = message.isAds ? parseBookForAds(doc, asin) : parseBook(doc, asin);
    console.log("parsed data", data)

    sendResponse({ data });
  }

  if (message.type === 'update-tracked-books') {
    scrapeTrackedBooks()
  }
})
