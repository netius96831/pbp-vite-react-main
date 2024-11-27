import { sendMessageToTabs } from './send-message-to-tabs';

// We want to call chrome.runtime.reload() whenever the heap gets too big... after maybe 100 scrapes?
// After we do that, we'll need to re-register the alarm + all the listeners
// This likely means wrapping all the listeners in a function that we can call on reload
// We'll also want to track how many scrapes we've performed, and reset it at that time as well
// To test, have it reset after 2 scrapes

export const setAlarms = () => {
  chrome.alarms.get('scrapeBooks', function(alarm) {
    console.log("existing alarm", alarm)
    if(!alarm) {
      chrome.alarms.create('scrapeBooks', { delayInMinutes: 0.5, periodInMinutes: 1 });
    }
  })

  chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === 'scrapeBooks') {

      chrome.tabs.query({ active: true }, function(tabs){
        sendMessageToTabs(tabs, {type: 'update-tracked-books'}, () => {});
      })
    }
  });
}

export default setAlarms;