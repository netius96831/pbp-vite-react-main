import sendMessage from "../adapters/send-message";

export const changeIconColor = (color: 'blue' | 'gray' | 'green' | 'yellow' | 'orange') => {
  sendMessage({type: 'icon-color', color})
}

export default changeIconColor;