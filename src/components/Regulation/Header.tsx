import React from 'react';

import BigNumber from "bignumber.js";
import { BalanceBlock } from "../common";

type RegulationHeaderProps = {
  totalSupply: BigNumber,
  totalBonded: BigNumber,
  totalStaged: BigNumber,
  totalRedeemable: BigNumber,
  price: BigNumber,
};

const RegulationHeader = ({
  totalSupply, totalBonded, totalStaged, totalRedeemable, price
}: RegulationHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="Total Supply" balance={totalSupply.decimalPlaces(2)} suffix=" ESD" />
    </div>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="Total Staged" balance={totalStaged.decimalPlaces(2)} suffix=" ESD" />
    </div>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="Total Bonded" balance={totalBonded.decimalPlaces(2)} suffix=" ESD" />
    </div>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="Total Redeemable" balance={totalRedeemable.decimalPlaces(2)} suffix=" ESD" />
    </div>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="Approx. Oracle Price" balance={price.decimalPlaces(2)} suffix=" USDC" />
    </div>
  </div>
);


export default RegulationHeader;
