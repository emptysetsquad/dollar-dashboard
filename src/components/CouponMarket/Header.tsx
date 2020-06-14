import React from 'react';

import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common";

type CouponMarketHeaderProps = {
  debt: BigNumber,
  supply: BigNumber,
};

const CouponMarketHeader = ({
  debt, supply,
}: CouponMarketHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Total Supply" balance={supply} suffix={" ESD"}/>
    </div>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Total Debt" balance={debt} suffix={" ESD"}/>
    </div>
  </div>
);


export default CouponMarketHeader;
