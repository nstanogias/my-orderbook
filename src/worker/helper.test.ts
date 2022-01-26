//unit testing helper functions

import { Delta, OrderBook } from '../models/models';
import { calculateDelta } from './helpers';

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
});
