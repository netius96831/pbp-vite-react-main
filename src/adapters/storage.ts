export const setStorage = async (obj: {[key: string]: any}, callback?: () => void) => {
  if(chrome.storage) {
    if(callback) {
      chrome.storage.local.set(obj, callback);
    } else {
      chrome.storage.local.set(obj);
    }
  } else {
    Object.keys(obj).forEach(key => {
      localStorage.setItem(key, obj[key]);
    });
    callback && callback();
  }
}

export const getStorage = async (keys: string[], callback?: (value: any) => void) => {
  if(chrome.storage) {
    if(callback) {
      chrome.storage.local.get(keys, callback);
    } else {
      return chrome.storage.local.get(keys);
    }
  } else {
    const result: {[key: string]: any} = {};
    keys.forEach(key => {
      result[key] = localStorage.getItem(key);
    });
    if(callback) {
      callback(result);
    } else {
      return result;
    }
  }
}