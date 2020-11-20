import React from 'react';

import BigNumber from "bignumber.js";
import {BalanceBlock} from "../common";

import {Box} from '@aragon/ui';
import {ownership} from "../../utils/number";

type RegulationHeaderProps = {
  totalSupply: BigNumber,

  totalBonded: BigNumber,
  totalStaged: BigNumber,
  totalRedeemable: BigNumber,

  poolLiquidity: BigNumber,
  poolRewarded: BigNumber,
  poolClaimable: BigNumber,

  legacyPoolRewarded: BigNumber,
  legacyPoolClaimable: BigNumber,

  totalDebt: BigNumber,
  totalCoupons: BigNumber,
  couponPremium: BigNumber,
};

const RegulationHeader = ({
  totalSupply,
  totalBonded, totalStaged, totalRedeemable,
  poolLiquidity, poolRewarded, poolClaimable,
  legacyPoolRewarded, legacyPoolClaimable,
  totalDebt, totalCoupons, couponPremium
}: RegulationHeaderProps) => {
  const daoTotalSupply = totalBonded.plus(totalStaged).plus(totalRedeemable);
  const poolTotalSupply = poolLiquidity.plus(poolRewarded).plus(poolClaimable);
  const legacyPoolTotalSupply = legacyPoolRewarded.plus(legacyPoolClaimable);
  const circulatingSupply = totalSupply.minus(daoTotalSupply).minus(poolTotalSupply).minus(legacyPoolTotalSupply);

  return (
    <>
      <Box heading="Supply Allocation">
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Total" balance={totalSupply} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="DAO" balance={ownership(daoTotalSupply, totalSupply)} suffix="%" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Uniswap" balance={ownership(poolTotalSupply, totalSupply)} suffix="%" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Circulating" balance={ownership(circulatingSupply, totalSupply)} suffix="%" />
          </div>
        </div>
      </Box>

      <Box heading="DAO Breakdown">
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Total" balance={daoTotalSupply} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Staged" balance={totalStaged} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Bonded" balance={totalBonded} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Redeemable" balance={totalRedeemable} suffix="" />
          </div>
        </div>
      </Box>

      <Box heading="Oracle Breakdown">
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Total" balance={poolTotalSupply} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Liquidity" balance={poolLiquidity} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Rewarded" balance={poolRewarded} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Claimable" balance={poolClaimable} suffix="" />
          </div>
        </div>
      </Box>

      <Box heading="Coupon Breakdown">
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Debt Ratio" balance={ownership(totalDebt, totalSupply)} suffix="%" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Debt" balance={totalDebt} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Coupons" balance={totalCoupons} suffix="" />
          </div>
          <div style={{ flexBasis: '25%' }}>
            <BalanceBlock asset="Premium" balance={couponPremium.multipliedBy(100)} suffix="%" />
          </div>
        </div>
      </Box>
    </>
  );
}


export default RegulationHeader;
