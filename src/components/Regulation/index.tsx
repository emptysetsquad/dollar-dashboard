import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {
  getEpoch,
  getInstantaneousPrice, getPoolTotalBonded, getPoolTotalClaimable, getPoolTotalRewarded, getToken0, getTokenBalance,
  getTokenTotalSupply, getTotalBonded, getTotalRedeemable, getTotalStaged,
} from '../../utils/infura';
import {ESD, ESDS, UNI, USDC} from "../../constants/tokens";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import RegulationHeader from "./Header";
import RegulationHistory from "./RegulationHistory";
import {BOOTSTRAPPING_EPOCHS, BOOTSTRAPPING_ORACLE_PRICE} from "../../constants/values";
import IconHeader from "../common/IconHeader";
import {DollarPool} from "../../constants/contracts";

async function approximatePrice(): Promise<BigNumber> {
  const [reserve, token0] = await Promise.all([getInstantaneousPrice(), getToken0()]);
  const token0Balance = new BigNumber(reserve.reserve0);
  const token1Balance = new BigNumber(reserve.reserve1);
  if (token0.toLowerCase() === USDC.addr.toLowerCase()) {
    return token0Balance.multipliedBy(new BigNumber(10).pow(12)).dividedBy(token1Balance);
  }
  return token1Balance.multipliedBy(new BigNumber(10).pow(12)).dividedBy(token0Balance);
}

function Regulation({ user }: {user: string}) {

  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [totalStaged, setTotalStaged] = useState(new BigNumber(0));
  const [totalRedeemable, setTotalRedeemable] = useState(new BigNumber(0));
  const [poolLiquidity, setPoolLiquidity] = useState(new BigNumber(0));
  const [poolTotalRewarded, setPoolTotalRewarded] = useState(new BigNumber(0));
  const [poolTotalClaimable, setPoolTotalClaimable] = useState(new BigNumber(0));

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        totalSupplyStr,
        totalBondedStr, totalStagedStr, totalRedeemableStr,
        poolLiquidityStr, poolTotalRewardedStr, poolTotalClaimableStr,
      ] = await Promise.all([
        getTokenTotalSupply(ESD.addr),

        getTotalBonded(ESDS.addr),
        getTotalStaged(ESDS.addr),
        getTotalRedeemable(ESDS.addr),

        getTokenBalance(ESD.addr, UNI.addr),
        getPoolTotalRewarded(DollarPool),
        getPoolTotalClaimable(DollarPool),
      ]);

      if (!isCancelled) {
        setTotalSupply(toTokenUnitsBN(totalSupplyStr, ESD.decimals));

        setTotalBonded(toTokenUnitsBN(totalBondedStr, ESD.decimals));
        setTotalStaged(toTokenUnitsBN(totalStagedStr, ESD.decimals));
        setTotalRedeemable(toTokenUnitsBN(totalRedeemableStr, ESD.decimals));

        setPoolLiquidity(toTokenUnitsBN(poolLiquidityStr, ESD.decimals));
        setPoolTotalRewarded(toTokenUnitsBN(poolTotalRewardedStr, ESD.decimals));
        setPoolTotalClaimable(toTokenUnitsBN(poolTotalClaimableStr, ESD.decimals));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <>
      <IconHeader icon={<i className="fas fa-chart-area"/>} text="Supply Regulation"/>

      <RegulationHeader
        totalSupply={totalSupply}

        totalBonded={totalBonded}
        totalStaged={totalStaged}
        totalRedeemable={totalRedeemable}

        poolLiquidity={poolLiquidity}
        poolRewarded={poolTotalRewarded}
        poolClaimable={poolTotalClaimable}
      />

      <Header primary="Regulation History" />

      <RegulationHistory
        user={user}
      />
    </>
  );
}

export default Regulation;
