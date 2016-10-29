import { browserHistory } from 'react-router';


// Action Types


// Actions
export function sendMessge (msg) {
  mainSocket.emit('send', msg);
}