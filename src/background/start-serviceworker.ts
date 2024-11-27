import setMessageListeners from "./message-listeners";
import setOnclickListener from "./onclick-listener";
import setAlarms from "./alarms";

export const startServiceWorker = () => {
  setMessageListeners();
  setOnclickListener();
  setAlarms();
}

export default startServiceWorker;