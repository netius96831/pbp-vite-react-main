import sendMessage from "./send-message";

export const openPage = (url: string) => {
  if (typeof chrome.extension === 'undefined') {
    // webpage context, so open directly
    window.open(url, '_blank');
  } else {
    // We're in the extension context, so send to service worker
    sendMessage({ type: 'open-page', url });
  }
}

export default openPage;