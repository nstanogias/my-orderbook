import { Delta, OrderBook, Snapshot } from '../models/models';

export const buildOrderBook = (currentBook: OrderBook | null, delta: Delta | Snapshot): OrderBook => {
  // initial dataset
  console.log(delta);
  // console.log(delta.asks);
  if (currentBook === null) {
    return { bids: delta.bids, asks: delta.asks };
  }

  // subsequent datasets
  return calculateDelta(currentBook, delta);
};

export const calculateDelta = (currentBook: OrderBook, delta: Delta): OrderBook => {
  const currentBids = currentBook.bids;
  const currentAsks = currentBook.asks;

  const deltaBids = [...delta.bids];
  const deltaAsks = [...delta.asks];

  // calculate delta: all new values plus old values not included in new new values
  currentBids.forEach((value, index) => {
    if (deltaBids.find((dbid) => dbid[0] === currentBids[index][0]) === undefined) {
      deltaBids.push(currentBids[index]);
    }
  });

  currentAsks.forEach((value, index) => {
    if (deltaAsks.find((dask) => dask[0] === currentAsks[index][0]) === undefined) {
      deltaAsks.push(currentAsks[index]);
    }
  });

  return {
    bids: deltaBids,
    asks: deltaAsks,
  };
};
