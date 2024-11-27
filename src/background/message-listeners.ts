import authProviders from '../utils/auth-providers';
import { sendMessageToTabs } from './send-message-to-tabs';

export default function setMessageListener() {
  chrome.runtime.onMessage.addListener(function(request, _sender, sendResponse) {
    if(request.type == 'icon-color') {
      chrome.action.setIcon({path: `icons/icon_${request.color}.png`})
    }

    if(request.type == 'login') {
      const { provider } = request
      const authProvider = authProviders.find(ap => ap.type === provider)
      if(!authProvider) {
        console.error(`No auth provider found for ${provider}`)
        return
      }

      fetch(authProvider.fetchUrl, { credentials: 'include' })
      .then(res => res.json())
      .then(res => {
        sendResponse(JSON.parse(res))
      })
    }

    if(request.type == 'open-page') {
      chrome.tabs.create({ url: request.url, active: true, selected: true })
    }

    if(request.type == 'scrape-book') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        const {url: tabUrl, id: tabId} = tabs[0]
        if (tabUrl && tabId) {
          fetch(tabUrl)
          .then(res => res.text())
          .then(html => {
            // Send the HTML to a content script for parsing, then send back data
            chrome.tabs.sendMessage(tabId, {type: 'parse-book-html', html, url: tabUrl}, function(response) {
              sendResponse(response);
            });
          })
        }
      });
    }

    if(request.type == 'background-scrape-tracked-book') {
      console.log("got background scrape request", request.isAds)
      chrome.tabs.query({ active: true }, function(tabs){
        console.log("sending background scrape")
        const { id: tabId } = tabs[0]
        if(!tabId) return

        fetch(request.url)
        .then(res => res.text())
        .then(html => {
          sendMessageToTabs(tabs, {type: 'parse-book-html', html, url: request.url, isAds: request.isAds}, function(response: any) {
            console.log("got background scrape response", response)
            sendResponse(response);
          });
        });
      })
    }

    if(request.type == 'notification') {
      const { title, body, iconUrl } = request
      chrome.notifications.create({
        type: 'basic',
        title,
        message: body,
        iconUrl,
      })
    }

    if(request.type == 'reopen-extension') {
      setTimeout(() => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          const tabId = tabs[0].id
          if(tabId) {
            chrome.tabs.sendMessage(tabId, {type: "extensionButtonClicked"});
          }
        })
      }, 3000)
    }

    return true; // allows sendResponse to be called asynchronously
  })
}