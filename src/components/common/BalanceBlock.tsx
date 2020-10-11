import React from 'react';

import BigNumber from 'bignumber.js';
import {formatBN} from "../../utils/number";

type BlanceBlockProps = {
  asset: string,
  balance: BigNumber | string | number
  suffix?: string
}

function BalanceBlock({ asset, balance, suffix=""}: BlanceBlockProps) {
  let integer = '0';
  let digits = '0';
  const balanceBN = new BigNumber(balance);
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split('.')
    integer = tokens[0];
    digits = tokens[1];
  }

  return (
    <>
      <div style={{ fontSize: 14, padding: 3 }}>{asset}</div>
      <div style={{ padding: 3 }}>
        <span style={{ fontSize: 24 }}>{integer}</span>
        .
        <span style={{ fontSize: 18 }}>
          {' '}
          {digits}
          {' '}
        </span>
        {suffix === "" ? '' : <span style={{ fontSize: 18 }}>{suffix}</span> }
      </div>
    </>
  );
}

export default BalanceBlock;
