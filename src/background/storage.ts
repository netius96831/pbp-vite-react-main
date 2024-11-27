
export const setStorageListener = () => {
  // This is currently purely for debugging purposes, although it may have a use later
  chrome.storage.onChanged.addListener(function(changes, _namespace) {
    for (var key in changes) {
      var storageChange = changes[key];
      const { oldValue, newValue } = storageChange
      console.log('Storage changed', key, oldValue, newValue);
    }
  })
}