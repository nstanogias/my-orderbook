//unit testing helper functions

import { Delta, OrderBatch, OrderBook, OrderLevel, OrderRow } from '../models/models';
import {
  buildOrderBatch,
  calculateDelta,
  calculateTotals,
  removeZeroSizeOrderLevels,
  sortOrderLevels,
  trimToNumLevels,
} from './helpers';

describe('helper functions', () => {
  test('calculates delta when new bids/asks arrive', () => {
    // Given
    const currentBook: OrderBook = {
      bids: [
        [1000, 100],
        [2000, 100],
        [3000, 100],
      ],
      asks: [
        [1000, 100],
        [2000, 100],
        [3000, 100],
      ],
    };

    const delta: Delta = {
      bids: [
        [1000, 50],
        [4000, 100],
        [5000, 100],
      ],
      asks: [
        [1000, 50],
        [4000, 100],
        [5000, 100],
      ],
      product_id: 'PI_XBTUSD',
      feed: 'book_ui_1',
    };

    const updatedBook: OrderBook = {
      bids: [
        [1000, 50],
        [4000, 100],
        [5000, 100],
        [2000, 100],
        [3000, 100],
      ],
      asks: [
        [1000, 50],
        [4000, 100],
        [5000, 100],
        [2000, 100],
        [3000, 100],
      ],
    };

    // When
    const output = calculateDelta(currentBook, delta);

    // Then
    expect(output).toEqual(updatedBook);
  });

  test('trim dataset to numLevels', () => {
    // Given
    const dataset: OrderLevel[] = [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ];
    const numLevels = 3;
    const expectedOutput: OrderLevel[] = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];

    // When
    const output = trimToNumLevels(dataset, numLevels);

    // Then
    expect(output).toEqual(expectedOutput);
  });

  test('remove zero size order levels', () => {
    // Given
    const dataset: OrderLevel[] = [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 0],
    ];
    const expectedOutput: OrderLevel[] = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];

    // When
    const output = removeZeroSizeOrderLevels(dataset);

    // Then
    expect(output).toEqual(expectedOutput);
  });

  test('sort order levels', () => {
    // Given
    const bidDataset: OrderLevel[] = [
      [1, 1],
      [3, 3],
      [2, 2],
      [4, 4],
    ];
    const askDataset: OrderLevel[] = [
      [1, 1],
      [3, 3],
      [2, 2],
      [4, 4],
    ];
    const bidExpectedOutput: OrderLevel[] = [
      [4, 4],
      [3, 3],
      [2, 2],
      [1, 1],
    ];
    const askExpectedOutput: OrderLevel[] = [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ];

    // When
    const bidOutput = sortOrderLevels(bidDataset, true);
    const askOutput = sortOrderLevels(askDataset, false);

    // Then
    expect(bidOutput).toEqual(bidExpectedOutput);
    expect(askOutput).toEqual(askExpectedOutput);
  });

  test('calculate totals', () => {
    // Given
    const dataset: OrderLevel[] = [
      [1, 1],
      [2, 2],
      [3, 3],
      [4, 4],
    ];
    const expectedOutput: OrderRow[] = [
      { price: 1, size: 1, total: 1 },
      { price: 2, size: 2, total: 3 },
      { price: 3, size: 3, total: 6 },
      { price: 4, size: 4, total: 10 },
    ];

    // When
    const output = calculateTotals(dataset);

    // Then
    expect(output).toEqual(expectedOutput);
  });
});

describe('order batch', () => {
  test('order batch built successfully', () => {
    // Given
    const dataSet: OrderBook = {
      bids: [
        [37838, 200],
        [37901, 0],
        [37840, 200],
        [37839, 200],
        [37900, 1],
      ],
      asks: [
        [37857, 200],
        [36999, 0],
        [37855, 200],
        [37856, 200],
        [37000, 1],
      ],
    };
    const numLevels = 3;
    const expectedOutput: OrderBatch = {
      bids: [
        { price: 37840, size: 200, total: 200 },
        { price: 37839, size: 200, total: 400 },
        { price: 37838, size: 200, total: 600 },
      ],
      asks: [
        { price: 37855, size: 200, total: 200 },
        { price: 37856, size: 200, total: 400 },
        { price: 37857, size: 200, total: 600 },
      ],
    };

    // When
    const output = buildOrderBatch(dataSet, numLevels);

    // Then
    expect(output).toEqual(expectedOutput);
  });
});
