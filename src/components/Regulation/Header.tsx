import React from 'react';

import BigNumber from "bignumber.js";

import {Box, Distribution} from '@aragon/ui';
import {formatMoney, ownership} from "../../utils/number";

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
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        <div style={{ flexBasis: '25%', marginRight: '2%' }}>
          <Box heading="Supply Allocation">
            <Distribution
              heading={`∅${formatMoney(totalSupply.toNumber())}`}
              items={[
                { item: 'DAO', percentage: +(ownership(daoTotalSupply, totalSupply).toNumber().toFixed(2)) },
                { item: 'Uniswap', percentage: +(ownership(poolTotalSupply, totalSupply).toNumber().toFixed(2)) },
                { item: 'Circulating', percentage: +(ownership(circulatingSupply, totalSupply).toNumber().toFixed(2)) },
              ]}
            />
          </Box>
        </div>
        <div style={{ flexBasis: '25%', marginRight: '2%' }}>
          <Box heading="DAO Breakdown">
            <Distribution
              heading={`∅${formatMoney(daoTotalSupply.toNumber())}`}
              items={[
                { item: 'Bonded', percentage: +(ownership(totalBonded, daoTotalSupply).toNumber().toFixed(2)) },
                { item: 'Staged', percentage: +(ownership(totalStaged, daoTotalSupply).toNumber().toFixed(2)) },
                { item: 'Redeemable', percentage: +(ownership(totalRedeemable, daoTotalSupply).toNumber().toFixed(2)) },
              ]}
            />
          </Box>
        </div>
        <div style={{ flexBasis: '25%' }}>
          <Box heading="Uniswap Breakdown">
            <Distribution
              heading={`∅${formatMoney(poolTotalSupply.toNumber())}`}
              items={[
                { item: 'Liquidity', percentage: +(ownership(poolLiquidity, poolTotalSupply).toNumber().toFixed(2)) },
                { item: 'Rewarded', percentage: +(ownership(poolRewarded, poolTotalSupply).toNumber().toFixed(2)) },
                { item: 'Claimable', percentage: +(ownership(poolClaimable, poolTotalSupply).toNumber().toFixed(2)) },
              ]}
            />
          </Box>
        </div>
      </div>
    </>
  );
}


export default RegulationHeader;
