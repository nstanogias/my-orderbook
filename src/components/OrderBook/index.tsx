import React, { useEffect, useState, useRef } from 'react';
// Use webpack loader syntax to load the worker with `worker-loader`.
// With this strategy, no ejection or CRA webpack config modification is necessary.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import FeedWorker from 'worker-loader!../../worker/feed.worker';
import { Action } from '../../models/models';
import { ActionType } from '../../enums/enums';

interface Props {
  productId: string;
}
const OrderBook: React.FC<Props> = ({ productId }) => {
  let feedWorker = useRef<Worker | null>(null);
  const [showReconnectMessage, setShowReconnectMessage] = useState<boolean>(false);

  useEffect(() => {
    feedWorker.current = new FeedWorker();
    openSocketConnection();
    document.addEventListener('visibilitychange', visibilitychangeHandler);
    /*
     * Handles incoming messages from feedWorker thread
     */
    feedWorker.current!.onmessage = (ev: MessageEvent) => {
      const data: Action = ev.data;
      switch (data.type) {
        case ActionType.OPEN_SOCKET_SUCCESS:
          feedWorker.current?.postMessage({ type: ActionType.SOCKET_SUBSCRIBE, payload: productId });
          break;
        case ActionType.UPDATE_ORDERBOOK:
          //update order book
          break;
      }
    };
    return () => {
      closeSocketConnection();
      feedWorker.current?.terminate();
      document.removeEventListener('visibilitychange', visibilitychangeHandler);
    };
  }, []);

  const openSocketConnection = () => {
    feedWorker.current?.postMessage({
      type: ActionType.OPEN_SOCKET,
    });
  };

  const closeSocketConnection = () => {
    feedWorker.current?.postMessage({
      type: ActionType.CLOSE_SOCKET,
    });
  };

  const visibilitychangeHandler = () => {
    if (document.visibilityState === 'hidden') {
      closeSocketConnection();
    } else {
      setShowReconnectMessage(true);
    }
  };

  const reconnectHandler = () => {
    openSocketConnection();
    setShowReconnectMessage(false);
  };

  return (
    <>
      <div>Orderbook</div>
      <button onClick={openSocketConnection}>Open connection</button>
      <button onClick={closeSocketConnection}>Close connection</button>
      {showReconnectMessage && (
        <div>
          <p>You got disconnected. Click the button below to reconnect.</p>
          <button onClick={reconnectHandler}>Reconnect</button>
        </div>
      )}
    </>
  );
};

export default OrderBook;
