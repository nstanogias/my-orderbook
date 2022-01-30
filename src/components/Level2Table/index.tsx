import { Fragment } from 'react';
import { OrderBatch, OrderRow } from '../../models/models';
import { AskPrice, BidPrice, Columns, Table } from './styles';

interface Props {
  batch: OrderBatch;
}

const Level2Table: React.FC<Props> = ({ batch }) => {
  return (
    <>
      <Table>
        <Columns>
          <div>Total</div>
          <div>Size</div>
          <div>Price</div>
          {batch.bids.map((row: OrderRow) => (
            <Fragment key={row.price}>
              <div>{row.total.toLocaleString('en')}</div>
              <div>{row.size.toLocaleString('en')}</div>
              <BidPrice>{row.price.toLocaleString('en')}</BidPrice>
            </Fragment>
          ))}
        </Columns>
        <Columns>
          <div>Price</div>
          <div>Size</div>
          <div>Total</div>
          {batch.asks.map((row: OrderRow) => (
            <Fragment key={row.price}>
              <AskPrice>{row.price.toLocaleString('en')}</AskPrice>
              <div>{row.size.toLocaleString('en')}</div>
              <div>{row.total.toLocaleString('en')}</div>
            </Fragment>
          ))}
        </Columns>
      </Table>
    </>
  );
};

export default Level2Table;
