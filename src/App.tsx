import React, { useState } from 'react';
import OrderBook from './components/OrderBook';

import { ProductId } from './models/models';
import { ProductIds } from './enums/enums';

const App: React.FC = () => {
  const [productId, setProductId] = useState<ProductId>(ProductIds.XBTUSD);

  const toggleHandler = () => {
    const newProductId = productId === ProductIds.XBTUSD ? ProductIds.ETHUSD : ProductIds.XBTUSD;
    setProductId(newProductId);
  };

  return (
    <>
      <div>Result</div>
      <button onClick={toggleHandler}>Toggle</button>
      <OrderBook productId={productId} />
    </>
  );
};

export default App;
