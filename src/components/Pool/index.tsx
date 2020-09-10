import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import {
  getPoolBalanceOfBonded, getPoolBalanceOfClaimable,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfStaged,
  getPoolStatusOf, getPoolTotalBonded,
  getTokenAllowance,
  getTokenBalance,
} from '../../utils/infura';
import {ESD, UNI, USDC} from "../../constants/tokens";
import { toTokenUnitsBN } from '../../utils/number';

import WithdrawDeposit from "./WithdrawDeposit";
import BondUnbond from "./BondUnbond";
import PoolPageHeader from "./Header";
import Claim from "./Claim";
import Provide from "./Provide";
import {DollarPool} from "../../constants/contracts";
import IconHeader from "../common/IconHeader";

function Pool({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
  const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
  const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
  const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
  const [userUSDCBalance, setUserUSDCBalance] = useState(new BigNumber(0));
  const [userUSDCAllowance, setUserUSDCAllowance] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userRewardedBalance, setUserRewardedBalance] = useState(new BigNumber(0));
  const [userClaimableBalance, setUserClaimableBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setPoolTotalBonded(new BigNumber(0));
      setPairBalanceESD(new BigNumber(0));
      setPairBalanceUSDC(new BigNumber(0));
      setUserUNIBalance(new BigNumber(0));
      setUserUNIAllowance(new BigNumber(0));
      setUserUSDCBalance(new BigNumber(0));
      setUserUSDCAllowance(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserRewardedBalance(new BigNumber(0));
      setUserClaimableBalance(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        poolTotalBondedStr, pairBalanceESDStr, pairBalanceUSDCStr, balance, usdcBalance,
        allowance, usdcAllowance, stagedBalance, bondedBalance,
        rewardedBalance, claimableBalance, status
      ] = await Promise.all([
        getPoolTotalBonded(DollarPool),
        getTokenBalance(ESD.addr, UNI.addr),
        getTokenBalance(USDC.addr, UNI.addr),
        getTokenBalance(UNI.addr, user),
        getTokenBalance(USDC.addr, user),
        getTokenAllowance(UNI.addr, user, DollarPool),
        getTokenAllowance(USDC.addr, user, DollarPool),
        getPoolBalanceOfStaged(DollarPool, user),
        getPoolBalanceOfBonded(DollarPool, user),
        getPoolBalanceOfRewarded(DollarPool, user),
        getPoolBalanceOfClaimable(DollarPool, user),
        getPoolStatusOf(DollarPool, user)
      ]);

      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, ESD.decimals);
      const pairESDBalance = toTokenUnitsBN(pairBalanceESDStr, ESD.decimals);
      const pairUSDCBalance = toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals);
      const userUNIBalance = toTokenUnitsBN(balance, UNI.decimals);
      const userUSDCBalance = toTokenUnitsBN(usdcBalance, USDC.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, UNI.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, UNI.decimals);
      const userRewardedBalance = toTokenUnitsBN(rewardedBalance, ESD.decimals);
      const userClaimableBalance = toTokenUnitsBN(claimableBalance, ESD.decimals);
      const userStatus = parseInt(status, 10);

      if (!isCancelled) {
        setPoolTotalBonded(new BigNumber(poolTotalBonded));
        setPairBalanceESD(new BigNumber(pairESDBalance));
        setPairBalanceUSDC(new BigNumber(pairUSDCBalance));
        setUserUNIBalance(new BigNumber(userUNIBalance));
        setUserUNIAllowance(new BigNumber(allowance));
        setUserUSDCAllowance(new BigNumber(usdcAllowance));
        setUserUSDCBalance(new BigNumber(userUSDCBalance));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserRewardedBalance(new BigNumber(userRewardedBalance));
        setUserClaimableBalance(new BigNumber(userClaimableBalance));
        setUserStatus(userStatus);
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
  // Check for error in .call()
  const isRewardedNegative = userRewardedBalance.isGreaterThan(new BigNumber("1000000000000000000"));

  return (
    <>
      <IconHeader icon={<i className="fas fa-parachute-box"/>} text="LP Reward Pool"/>

      <PoolPageHeader
        accountUNIBalance={userUNIBalance}
        accountBondedBalance={userBondedBalance}
        accountRewardedESDBalance={isRewardedNegative ? new BigNumber(0) : userRewardedBalance}
        accountClaimableESDBalance={userClaimableBalance}
        poolTotalBonded={poolTotalBonded}
        accountPoolStatus={userStatus}
      />

      <WithdrawDeposit
        user={user}
        balance={userUNIBalance}
        allowance={userUNIAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
      />

      <BondUnbond
        isRewardNegative={isRewardedNegative}
        staged={userStagedBalance}
        bonded={userBondedBalance}
      />

      <Claim
        claimable={userClaimableBalance}
        status={userStatus}
      />

      <Provide
        user={user}
        rewarded={isRewardedNegative ? new BigNumber(0) : userRewardedBalance}
        status={userStatus}
        pairBalanceESD={pairBalanceESD}
        pairBalanceUSDC={pairBalanceUSDC}
        userUSDCBalance={userUSDCBalance}
        userUSDCAllowance={userUSDCAllowance}
      />
    </>
  );
}

export default Pool;
