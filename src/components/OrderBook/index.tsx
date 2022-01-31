import React, { useEffect, useState, useRef } from 'react';
// Use webpack loader syntax to load the worker with `worker-loader`.
// With this strategy, no ejection or CRA webpack config modification is necessary.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
import FeedWorker from 'worker-loader!../../worker/feed.worker';
import { Action, OrderBatch, ProductId } from '../../models/models';
import { ActionType, ProductIds } from '../../enums/enums';
import Level2Table from '../Level2Table';
import { ReconnectMessage, Button, Header, Footer } from './styles';

const OrderBook: React.FC = () => {
  let feedWorker = useRef<Worker | null>(null);
  const [showReconnectMessage, setShowReconnectMessage] = useState<boolean>(false);
  const [orderBatch, setOrderBatch] = useState<OrderBatch>({ bids: [], asks: [] });
  let productId = useRef<ProductId>(ProductIds.XBTUSD); // this was not working with state because of asynchronous nature!

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
          subscribe();
          break;
        case ActionType.UPDATE_ORDERBOOK:
          //update order book
          setOrderBatch(data.payload);
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
    unsubscribe();
    feedWorker.current?.postMessage({
      type: ActionType.CLOSE_SOCKET,
    });
  };

  const subscribe = () => {
    feedWorker.current?.postMessage({ type: ActionType.SOCKET_SUBSCRIBE, payload: productId.current });
  };

  const unsubscribe = () => {
    feedWorker.current?.postMessage({ type: ActionType.SOCKET_UNSUBSCRIBE, payload: productId.current });
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

  const toggleHandler = () => {
    unsubscribe();
    const newProductId = productId.current === ProductIds.XBTUSD ? ProductIds.ETHUSD : ProductIds.XBTUSD;
    productId.current = newProductId;
    subscribe();
  };

  const orderBatchNotEmpty = orderBatch.bids.length > 0 && orderBatch.asks.length > 0;
  return (
    <>
      <Header>
        <div>Orderbook</div>
        <div>{productId.current}</div>
      </Header>
      {orderBatchNotEmpty && (
        <>
          <Level2Table batch={orderBatch}></Level2Table>
          <Footer>
            {showReconnectMessage ? (
              <>
                <ReconnectMessage>You got disconnected. Click the button below to reconnect.</ReconnectMessage>
                <Button onClick={reconnectHandler}>Reconnect</Button>
              </>
            ) : (
              <Button onClick={toggleHandler}>Toggle Feed</Button>
            )}
          </Footer>
        </>
      )}
    </>
  );
};

export default OrderBook;
