import React from 'react';

import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common";
import {ownership} from "../../utils/number";

type CouponMarketHeaderProps = {
  debt: BigNumber,
  supply: BigNumber,
  premium: BigNumber
};

const CouponMarketHeader = ({
  debt, supply, premium
}: CouponMarketHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Total Debt" balance={debt} suffix={"ESD"}/>
    </div>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Debt Ratio" balance={ownership(debt, supply)} suffix={"%"}/>
    </div>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Premium" balance={premium.multipliedBy(100)} suffix={"%"}/>
    </div>
  </div>
);


export default CouponMarketHeader;
