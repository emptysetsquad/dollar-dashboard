import React from 'react';

import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common";
import {ownership} from "../../utils/number";

type CouponMarketHeaderProps = {
  debt: BigNumber,
  supply: BigNumber,
  coupons: BigNumber,
  premium: BigNumber,
  redeemable: BigNumber,
};

const CouponMarketHeader = ({
  debt, supply, coupons, premium, redeemable
}: CouponMarketHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Debt Ratio" balance={ownership(debt, supply)} suffix={"%"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Total Debt" balance={debt} suffix={"ESD"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Coupons" balance={coupons} />
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Premium" balance={premium.multipliedBy(100)} suffix={"%"}/>
    </div>
    <div style={{ flexBasis: '20%' }}>
      <BalanceBlock asset="Redeemable" balance={redeemable}/>
    </div>
  </div>
);


export default CouponMarketHeader;
