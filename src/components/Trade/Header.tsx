import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock, AddressBlock } from '../common/index';

type TradePageHeaderProps = {
  pairBalanceESD: BigNumber,
  pairBalanceUSDC: BigNumber,
  uniswapPair: string,
};

const TradePageHeader = ({
  pairBalanceESD, pairBalanceUSDC, uniswapPair,
}: TradePageHeaderProps) => {
  const price = pairBalanceUSDC.dividedBy(pairBalanceESD);

  return (
    <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '25%' }}>
        <BalanceBlock asset="ESD Price" balance={price} suffix={"USDC"}/>
      </div>
      <div style={{ width: '25%' }}>
        <BalanceBlock asset="ESD Liquidity" balance={pairBalanceESD} suffix={"ESD"}/>
      </div>
      <div style={{ width: '25%' }}>
        <BalanceBlock asset="USDC Liquidity" balance={pairBalanceUSDC} suffix={"USDC"}/>
      </div>
      <div style={{ width: '25%' }}>
        <>
          <AddressBlock label="Uniswap Contract" address={uniswapPair} />
        </>
      </div>
    </div>
  );
}


export default TradePageHeader;
