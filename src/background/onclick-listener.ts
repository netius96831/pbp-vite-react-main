export const setOnclickListener = () => {
  chrome.action.onClicked.addListener(function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      const tabId = tabs[0].id
      if(tabId) {
        chrome.tabs.sendMessage(tabId, {type: "extensionButtonClicked"});
      }
    })
  });
}

export default setOnclickListener;