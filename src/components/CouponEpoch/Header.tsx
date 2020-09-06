import React from 'react';

import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common";

type CouponEpochHeaderProps = {
  redeemable: BigNumber,
  outstanding: BigNumber,
  balance: BigNumber,
};

const CouponEpochHeader = ({
  redeemable, outstanding, balance,
}: CouponEpochHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Total Redeemable" balance={redeemable} suffix={" ESD"}/>
    </div>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Outstanding Coupons" balance={outstanding} />
    </div>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Coupon Balance" balance={balance} />
    </div>
  </div>
);


export default CouponEpochHeader;
