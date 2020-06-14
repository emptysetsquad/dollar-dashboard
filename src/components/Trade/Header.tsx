import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock, AddressBlock } from '../common/index';

type  TradePageHeaderProps = {
  pairBalanceESD: BigNumber,
  pairBalanceUSDC: BigNumber,
  uniswapPair: string,
};

const TradePageHeader = ({
  pairBalanceESD, pairBalanceUSDC, uniswapPair,
}: TradePageHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '30%' }}>
      <BalanceBlock asset="Total ESD Liquidity" balance={pairBalanceESD} />
    </div>
    <div style={{ width: '30%' }}>
      <BalanceBlock asset="Total USDC Liquidity" balance={pairBalanceUSDC} />
    </div>
    <div style={{ width: '40%' }}>
      <>
        <AddressBlock label="Uniswap Contract" address={uniswapPair} />
      </>
    </div>
  </div>
);


export default TradePageHeader;
