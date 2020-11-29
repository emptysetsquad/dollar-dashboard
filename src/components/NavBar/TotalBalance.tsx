import React, {useEffect, useState} from 'react';

import {
  Button, IdentityBadge, IconConnect, Box, IconPower, LinkBase,
} from '@aragon/ui';

import { connect } from '../../utils/web3';
import BigNumber from "bignumber.js";
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getPoolBalanceOfBonded, getPoolBalanceOfClaimable, getPoolBalanceOfRewarded, getPoolBalanceOfStaged,
  getTokenBalance,
  getTokenTotalSupply
} from "../../utils/infura";
import {ESD, ESDS, UNI, USDC} from "../../constants/tokens";
import {formatBN, toTokenUnitsBN} from "../../utils/number";
import {getPoolAddress} from "../../utils/pool";

type TotalBalanceProps = {
  user: string,
}

function TotalBalance({ user }: TotalBalanceProps) {
  const [totalBalance, setTotalBalance] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setTotalBalance(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolAddress();

      const [
        esdBalance, stagedBalance, bondedBalance,
        pairBalanceESDStr, pairTotalSupplyUNIStr, userUNIBalanceStr,
        userPoolBondedBalanceStr, userPoolStagedBalanceStr,
        userPoolRewardedBalanceStr, userPoolClaimableBalanceStr,
      ] = await Promise.all([
        getTokenBalance(ESD.addr, user),
        getBalanceOfStaged(ESDS.addr, user),
        getBalanceBonded(ESDS.addr, user),

        getTokenBalance(ESD.addr, UNI.addr),
        getTokenTotalSupply(UNI.addr),
        getTokenBalance(UNI.addr, user),
        getPoolBalanceOfBonded(poolAddress, user),
        getPoolBalanceOfStaged(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
      ]);

      console.log(esdBalance)
      console.log(stagedBalance)
      console.log(bondedBalance)
      console.log(pairBalanceESDStr)
      console.log(pairTotalSupplyUNIStr)
      console.log(userUNIBalanceStr)
      console.log(userPoolBondedBalanceStr)
      console.log(userPoolStagedBalanceStr)
      console.log(userPoolRewardedBalanceStr)
      console.log(userPoolClaimableBalanceStr)

      const userBalance = toTokenUnitsBN(new BigNumber(esdBalance), ESD.decimals);
      const userStagedBalance = toTokenUnitsBN(new BigNumber(stagedBalance), ESDS.decimals);
      const userBondedBalance = toTokenUnitsBN(new BigNumber(bondedBalance), ESDS.decimals);

      const userUNIBalance = toTokenUnitsBN(new BigNumber(userUNIBalanceStr), ESDS.decimals);
      const userPoolBondedBalance = toTokenUnitsBN(new BigNumber(userPoolBondedBalanceStr), ESDS.decimals);
      const userPoolStagedBalance = toTokenUnitsBN(new BigNumber(userPoolStagedBalanceStr), ESDS.decimals);
      const userPoolRewardedBalance = toTokenUnitsBN(new BigNumber(userPoolRewardedBalanceStr), ESDS.decimals);
      const userPoolClaimableBalance = toTokenUnitsBN(new BigNumber(userPoolClaimableBalanceStr), ESDS.decimals);

      const UNItoESD = new BigNumber(pairBalanceESDStr).dividedBy(new BigNumber(pairTotalSupplyUNIStr));

      const daoTotalBalance = userStagedBalance.plus(userBondedBalance);
      const poolTotalBalance = UNItoESD.multipliedBy(userPoolStagedBalance.plus(userPoolBondedBalance))
        .plus(userPoolRewardedBalance.plus(userPoolClaimableBalance));
      const circulationBalance = UNItoESD.multipliedBy(userUNIBalance).plus(userBalance)

      const totalBalance = daoTotalBalance.plus(poolTotalBalance).plus(circulationBalance)

      if (!isCancelled) {
        setTotalBalance(totalBalance);
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
    <div style={{ fontSize: 14, padding: 3, fontWeight: 400, lineHeight: 1.5, fontFamily: 'aragon-ui-monospace, monospace'}}>
      ∅{formatBN(totalBalance, 2)}
    </div>
  );
}


export default TotalBalance;
