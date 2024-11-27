export const sendMessageToTabs = (
  tabs: chrome.tabs.Tab[],
  message: { type: string, [key: string]: any },
  callback: (response: any) => void) => {
  const tabId = tabs[0]?.id;
  if(tabId) {
    chrome.tabs.sendMessage(tabId, message, function(response) {
      if (chrome.runtime.lastError) {
        sendMessageToTabs(tabs.slice(1), message, callback);
      } else {
        if (callback) callback(response);
      }
    });
  }
}

export default sendMessageToTabs;