import { Delta, OrderLevel, OrderBatch, OrderBook, Snapshot, OrderRow } from '../models/models';

export const buildOrderBook = (currentBook: OrderBook | null, delta: Delta | Snapshot): OrderBook => {
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

/*
 * Creates the batch that Worker sends to UI
 */
export const buildOrderBatch = (orderBook: OrderBook, numLevels: number): OrderBatch => {
  return {
    bids: calculateTotals(sortOrderLevels(trimToNumLevels(removeZeroSizeOrderLevels(orderBook.bids), numLevels), true)),
    asks: calculateTotals(
      sortOrderLevels(trimToNumLevels(removeZeroSizeOrderLevels(orderBook.asks), numLevels), false)
    ),
  };
};

/*
 * Trims to numLevels due to screen size constraints
 */
export const trimToNumLevels = (dataset: OrderLevel[], numLevels: number): OrderLevel[] => {
  return dataset.length <= numLevels ? dataset : dataset.slice(0, numLevels);
};

export const removeZeroSizeOrderLevels = (orderLevels: OrderLevel[]): OrderLevel[] => {
  return orderLevels.filter((orderLevel) => orderLevel[1] != 0);
};

/*
 * Sort order levels
 */
export const sortOrderLevels = (orderLevels: OrderLevel[], isBid: boolean): OrderLevel[] => {
  return orderLevels.sort((ol1: OrderLevel, ol2: OrderLevel): number => {
    if (!isBid) return ol1[0] - ol2[0];
    if (isBid) return ol2[0] - ol1[0];
    return 0;
  });
};

/*
 * Calculate totals
 */
export const calculateTotals = (orderLevels: OrderLevel[]): OrderRow[] => {
  let total = 0;

  return orderLevels.map((orderLevel) => {
    total = total + orderLevel[1];
    return {
      price: orderLevel[0],
      size: orderLevel[1],
      total: total,
    };
  });
};
