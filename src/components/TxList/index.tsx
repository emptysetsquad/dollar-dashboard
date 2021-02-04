import React from 'react';

import useTxHistory from "../../hooks/useTxHistory";

function TxList() {
  const { txs } = useTxHistory();

  return (
    <div style={{position: 'relative', float: 'right', paddingRight: '1%'}}>
      {
        txs.map((tx, idx) =>
          <div key={idx}>TX: {tx.hash}</div>
        )
      }
    </div>
  );
}

export default TxList;
