import sendMessage from "./send-message";

export const sendNotification = (title: string, body: string, iconUrl: string) => {
  if (typeof chrome.extension === 'undefined') {
    window.alert(`${title}: ${body}`);
  } else {
    sendMessage({ type: 'notification', title, body, iconUrl })
  }
}
