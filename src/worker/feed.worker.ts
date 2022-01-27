import { ActionType } from '../enums/enums';
import { Action, OrderBook, ProductId } from '../models/models';
import { buildOrderBatch, buildOrderBook } from './helpers';

let socketInstance: WebSocket | null = null;
let isSubscribed = false;
let orderBook: OrderBook | null = null;
let numLevels: number;
const socketUrl = 'wss://www.cryptofacilities.com/ws/v1';

/*
 * Socket Management: handles incoming messages from socket server
 */
const createAndOpenSocket = () => {
  socketInstance = new WebSocket(socketUrl);

  socketInstance.onopen = () => {
    console.log('[SOCKET]: Connetion is open');
    postMessage({ type: ActionType.OPEN_SOCKET_SUCCESS });
  };

  socketInstance.onclose = () => {
    console.log('[SOCKET]: Connetion is closed');
  };

  socketInstance.onmessage = (ev: MessageEvent) => {
    const data = JSON.parse(ev.data);
    if (data.event) {
      switch (data.event) {
        case 'subscribed':
          console.log('[SOCKET]: Subscribed successfully');
          isSubscribed = true;
          break;
        case 'unsubscribed':
          console.log('[SOCKET]: Unsubscribed successfully');
          isSubscribed = false;
          break;
      }
    } else {
      if (data.numLevels) {
        numLevels = data.numLevels;
      }
      orderBook = buildOrderBook(orderBook, data);
      console.log(orderBook);
      postMessage({
        type: ActionType.UPDATE_ORDERBOOK,
        payload: buildOrderBatch(orderBook, numLevels),
      });
    }
  };
};

const closeSocket = () => {
  socketInstance?.close();
  socketInstance = null;
};

/*
 * WebWorker Management: handles incoming messages from main thread
 */
onmessage = (ev: MessageEvent) => {
  const data: Action = ev.data;
  switch (data.type) {
    case ActionType.OPEN_SOCKET:
      console.log('[WORKER]: Opening socket...');
      createAndOpenSocket();
      break;
    case ActionType.CLOSE_SOCKET:
      if (socketInstance) {
        console.log('[WORKER]: Closing socket...');
        closeSocket();
      }
      break;
    case ActionType.SOCKET_SUBSCRIBE:
      console.log('[WORKER]: Calling socket subscribe ', data.payload);
      subscribe(data.payload);
      break;
    case ActionType.SOCKET_UNSUBSCRIBE:
      console.log('[WORKER]: Calling socket Unsubscribe ', data.payload);
      unsubscribe(data.payload);
      break;
  }
};

const subscribe = (productId: ProductId) => {
  while (isSubscribed) {
    console.log('stuck in unsubscribing!');
  }
  const subscriptionMessage = { event: 'subscribe', feed: 'book_ui_1', product_ids: [productId] };
  socketInstance?.send(JSON.stringify(subscriptionMessage));
};

const unsubscribe = (productId: ProductId) => {
  const unsubscriptionMessage = { event: 'unsubscribe', feed: 'book_ui_1', product_ids: [productId] };
  socketInstance?.send(JSON.stringify(unsubscriptionMessage));
};
// eslint-disable-next-line import/no-anonymous-default-export
export default {};
