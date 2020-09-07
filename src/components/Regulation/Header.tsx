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
};

const RegulationHeader = ({
  totalSupply,
  totalBonded, totalStaged, totalRedeemable,
  poolLiquidity, poolRewarded, poolClaimable
}: RegulationHeaderProps) => {
  const daoTotalSupply = totalBonded.plus(totalStaged).plus(totalRedeemable);
  const poolTotalSupply = poolLiquidity.plus(poolRewarded).plus(poolClaimable);

  return (
    <>
      <Box heading="Supply Allocation">
        <div style={{display: 'flex'}}>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Total" balance={totalSupply} suffix="" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="DAO" balance={ownership(daoTotalSupply, totalSupply)} suffix="%" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="LP Pool" balance={ownership(poolTotalSupply, totalSupply)} suffix="%" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Circulating" balance={ownership(totalSupply.minus(daoTotalSupply).minus(poolTotalSupply), totalSupply)} suffix="%" />
          </div>
        </div>
      </Box>

      <Box heading="DAO Breakdown">
        <div style={{display: 'flex'}}>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Total" balance={daoTotalSupply} suffix="" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Staged" balance={totalStaged} suffix="" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Bonded" balance={totalBonded} suffix="" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Redeemable" balance={totalRedeemable} suffix="" />
          </div>
        </div>
      </Box>

      <Box heading="Oracle Breakdown">
        <div style={{display: 'flex'}}>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Total" balance={poolTotalSupply} suffix="" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Liquidity" balance={poolLiquidity} suffix="" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Rewarded" balance={poolRewarded} suffix="" />
          </div>
          <div style={{ width: '25%' }}>
            <BalanceBlock asset="Claimable" balance={poolClaimable} suffix="" />
          </div>
        </div>
      </Box>
    </>
  );
}


export default RegulationHeader;
