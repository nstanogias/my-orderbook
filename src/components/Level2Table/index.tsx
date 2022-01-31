import { OrderBatch, OrderRow } from '../../models/models';
import { AskPrice, BidPrice, SpreadRow, Table, TableHeader, BidRow, AskRow, TableSide } from './styles';

interface Props {
  batch: OrderBatch;
}

interface RowDepthStyles {
  background: string;
}

const calculateRowDepthStyle = (orderRowTotal: number, batchTotal: number, isBid: boolean): RowDepthStyles => {
  const rowDepth = ((orderRowTotal / batchTotal) * 100).toFixed(2);
  const side = isBid ? 'to left' : 'to right';
  const color = isBid ? '#08885d26' : '#d4604826';

  const background = `linear-gradient(${side}, ${color} ${rowDepth}%, transparent ${rowDepth}%)`;

  return { background };
};

const Level2Table: React.FC<Props> = ({ batch }) => {
  const batchBidTotal = batch.bids[batch.bids.length - 1].total;
  const batchAskTotal = batch.asks[batch.asks.length - 1].total;
  const spread = batch.asks[0].price - batch.bids[0].price;
  const spreadPercentage = ((spread / batch.asks[0].price) * 100).toFixed(2);

  return (
    <>
      <SpreadRow>
        Spread: {spread} ({spreadPercentage}%)
      </SpreadRow>
      <Table>
        <TableSide>
          <TableHeader hideInMobile={true}>
            <div>Total</div>
            <div>Size</div>
            <div>Price</div>
          </TableHeader>

          {batch.bids.map((row: OrderRow) => (
            <BidRow key={row.price} style={calculateRowDepthStyle(row.total, batchBidTotal, true)}>
              <div>{row.total.toLocaleString('en')}</div>
              <div>{row.size.toLocaleString('en')}</div>
              <BidPrice>{row.price.toLocaleString('en')}</BidPrice>
            </BidRow>
          ))}
        </TableSide>
        <TableSide isAsk={true}>
          <TableHeader>
            <div>Price</div>
            <div>Size</div>
            <div>Total</div>
          </TableHeader>

          {batch.asks.map((row: OrderRow) => (
            <AskRow key={row.price} style={calculateRowDepthStyle(row.total, batchAskTotal, false)}>
              <AskPrice>{row.price.toLocaleString('en')}</AskPrice>
              <div>{row.size.toLocaleString('en')}</div>
              <div>{row.total.toLocaleString('en')}</div>
            </AskRow>
          ))}
        </TableSide>
      </Table>
    </>
  );
};

export default Level2Table;
