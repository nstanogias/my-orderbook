import { ActionType } from '../enums/enums';

export interface Snapshot {
  numLevels: number;
  feed: string;
  bids: OrderLevel[];
  asks: OrderLevel[];
  product_id: ProductId;
}

export interface Delta {
  feed: string;
  bids: OrderLevel[];
  asks: OrderLevel[];
  product_id: ProductId;
}

export interface OrderBook {
  bids: OrderLevel[];
  asks: OrderLevel[];
}

export interface OrderRow {
  price: number;
  size: number;
  total: number;
}

//this is the final data set that worker builds and sends to UI
export interface OrderBatch {
  bids: OrderRow[];
  asks: OrderRow[];
}

export type Price = number;
export type Size = number;
export type OrderLevel = [Price, Size];
export type ProductId = 'PI_XBTUSD' | 'PI_ETHUSD';

interface OpenSocketAction {
  type: ActionType.OPEN_SOCKET;
}

interface CloseSocketAction {
  type: ActionType.CLOSE_SOCKET;
}

interface OpenSocketSuccessAction {
  type: ActionType.OPEN_SOCKET_SUCCESS;
}

interface SocketSubscribeAction {
  type: ActionType.SOCKET_SUBSCRIBE;
  payload: ProductId;
}

interface SocketUnsubscribeAction {
  type: ActionType.SOCKET_UNSUBSCRIBE;
  payload: ProductId;
}

interface UpdateOrderBookAction {
  type: ActionType.UPDATE_ORDERBOOK;
  payload: OrderBatch;
}

export type Action =
  | OpenSocketAction
  | CloseSocketAction
  | OpenSocketSuccessAction
  | SocketSubscribeAction
  | SocketUnsubscribeAction
  | UpdateOrderBookAction;
