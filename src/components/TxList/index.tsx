import React from 'react';
import { TransactionBadge } from '@aragon/ui';

import useTxHistory from "../../hooks/useTxHistory";

function TxList() {
  const { txs } = useTxHistory();

  return (
    <div style={{position: 'relative', float: 'right', paddingRight: '1%'}}>
      {
        txs.map((tx, idx) =>
          <div key={idx}>
            <div>{tx.description} - {tx.status}</div>
            <TransactionBadge
              transaction={tx.hash}
              shorten
            />
          </div>
        )
      }
    </div>
  );
}

export default TxList;
