import React, { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import Context from "./Context";

import {
  getPoolTotalBonded,
  getTokenAllowance,
  getTokenBalance,
  getPoolBalanceOfStaged,
  getPoolBalanceOfBonded,
  getPoolBalanceOfClaimable,
  getPoolBalanceOfRewarded,
  getPoolStatusOf,
  getPoolFluidUntil,
} from '../../utils/infura';
import {
  approve,
  depositPool,
  withdrawPool,
  bondPool,
  unbondPool,
  claimPool,
  providePool,
} from '../../utils/web3';
import { getPoolAddress, getLegacyPoolAddress } from "../../utils/pool";
import { ESD, UNI, USDC } from "../../constants/tokens";
import { toTokenUnitsBN, toBaseUnitBN } from '../../utils/number';

const Provider: React.FC = ({ children }) => {
  const [poolAddress, setPoolAddress] = useState('');
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [pairESDBalance, setPairESDBalance] = useState(new BigNumber(0));
  const [pairUSDCBalance, setPairUSDCBalance] = useState(new BigNumber(0));

  const [userUSDCAllowance, setUserUSDCAllowance] = useState(new BigNumber(0));
  const [userLPAllowance, setUserLPAllowance] = useState(new BigNumber(0));
  const [userLPStagedBalance, setUserLPStagedBalance] = useState(new BigNumber(0));
  const [userLPBondedBalance, setUserLPBondedBalance] = useState(new BigNumber(0));
  const [userESDClaimableBalance, setUserESDClaimableBalance] = useState(new BigNumber(0));
  const [userESDRewardedBalance, setUserESDRewardedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userLockedUntil, setUserLockedUntil] = useState(0);

  const [legacyAddress, setLegacyAddress] = useState('');
  const [legacyLPStagedBalance, setLegacyLPStagedBalance] = useState(new BigNumber(0));
  const [legacyLPBondedBalance, setLegacyLPBondedBalance] = useState(new BigNumber(0));
  const [legacyESDClaimableBalance, setLegacyESDClaimableBalance] = useState(new BigNumber(0));
  const [legacyESDRewardedBalance, setLegacyESDRewardedBalance] = useState(new BigNumber(0));
  const [legacyStatus, setLegacyStatus] = useState(0);
  const [hasLegacyBalance, setHasLegacyBalance] = useState(false);

  const { account, ethereum }: { account: string | null; ethereum: provider } = useWallet();

  const fetchData = useCallback(
    async (userAddress: string, provider: provider) => {
      const pool = await getPoolAddress();
      setPoolAddress(pool);

      const data = await Promise.all([
        getPoolTotalBonded(pool),
        getTokenBalance(ESD.addr, UNI.addr),
        getTokenBalance(USDC.addr, UNI.addr),

        getTokenAllowance(USDC.addr, userAddress, pool),
        getTokenAllowance(UNI.addr, userAddress, pool),
        getPoolBalanceOfStaged(pool, userAddress),
        getPoolBalanceOfBonded(pool, userAddress),
        getPoolBalanceOfClaimable(pool, userAddress),
        getPoolBalanceOfRewarded(pool, userAddress),
        getPoolStatusOf(pool, userAddress),
        getPoolFluidUntil(pool, userAddress),
      ]);

      setTotalBonded(toTokenUnitsBN(data[0], ESD.decimals));
      setPairESDBalance(toTokenUnitsBN(data[1], ESD.decimals));
      setPairUSDCBalance(toTokenUnitsBN(data[2], USDC.decimals));

      setUserUSDCAllowance(new BigNumber(data[3]));
      setUserLPAllowance(new BigNumber(data[4]));
      setUserLPStagedBalance(toTokenUnitsBN(data[5], UNI.decimals));
      setUserLPBondedBalance(toTokenUnitsBN(data[6], UNI.decimals));
      setUserESDClaimableBalance(toTokenUnitsBN(data[7], ESD.decimals));
      setUserESDRewardedBalance(toTokenUnitsBN(data[8], ESD.decimals));
      setUserStatus(parseInt(data[9], 10));
      setUserLockedUntil(parseInt(data[10], 10));
    },
    [setPoolAddress, setPairESDBalance, setPairUSDCBalance, setTotalBonded,
     setUserUSDCAllowance, setUserLPAllowance, setUserLPStagedBalance,
     setUserLPBondedBalance, setUserESDClaimableBalance,
     setUserESDRewardedBalance, setUserStatus, setUserLockedUntil]
  );

  const fetchLegacy = useCallback(
    async (userAddress: string, provider: provider) => {
      if (!poolAddress) return;
      const pool = await getLegacyPoolAddress(poolAddress);
      setLegacyAddress(pool);

      const data = await Promise.all([
        getPoolBalanceOfStaged(pool, userAddress),
        getPoolBalanceOfBonded(pool, userAddress),
        getPoolBalanceOfClaimable(pool, userAddress),
        getPoolBalanceOfRewarded(pool, userAddress),
        getPoolStatusOf(pool, userAddress),
      ]);

      setLegacyLPStagedBalance(toTokenUnitsBN(data[0], UNI.decimals));
      setLegacyLPBondedBalance(toTokenUnitsBN(data[1], UNI.decimals));
      setLegacyESDClaimableBalance(toTokenUnitsBN(data[2], ESD.decimals));
      setLegacyESDRewardedBalance(toTokenUnitsBN(data[3], ESD.decimals));
      setLegacyStatus(parseInt(data[4], 10));
    },
    [poolAddress, setLegacyLPStagedBalance, setLegacyLPBondedBalance,
     setLegacyESDClaimableBalance, setLegacyESDRewardedBalance, setLegacyStatus]
  );

  const handleApprove = useCallback(async (address: string) => {
    approve(address, poolAddress);
  }, [poolAddress]);

  const handleDeposit = useCallback(async (amount: BigNumber, callback) => {
    depositPool(
      poolAddress,
      toBaseUnitBN(amount, UNI.decimals),
      callback,
    );
  }, [poolAddress]);

  const handleWithdraw = useCallback(async (pool: string, amount: BigNumber, callback) => {
    withdrawPool(
      pool,
      toBaseUnitBN(amount, UNI.decimals),
      callback,
    );
  }, []);

  const handleBond = useCallback(async (amount: BigNumber, callback) => {
    bondPool(
      poolAddress,
      toBaseUnitBN(amount, UNI.decimals),
      callback,
    );
  }, [poolAddress]);

  const handleUnbond = useCallback(async (pool: string, amount: BigNumber, callback) => {
    unbondPool(
      pool,
      toBaseUnitBN(amount, UNI.decimals),
      callback,
    );
  }, []);

  const handleClaim = useCallback(async (pool: string, amount: BigNumber, callback) => {
    claimPool(
      pool,
      toBaseUnitBN(amount, ESD.decimals),
      callback,
    );
  }, []);

  const handleProvide = useCallback(async (amount: BigNumber, callback) => {
    providePool(
      poolAddress,
      toBaseUnitBN(amount, ESD.decimals),
      callback,
    );
  }, [poolAddress]);

  useEffect(() => {
    if (account && ethereum) {
      fetchData(account, ethereum);
      let refreshInterval = setInterval(() => fetchData(account, ethereum), 15000);
      return () => clearInterval(refreshInterval);
    }
  }, [account, ethereum, fetchData]);

  useEffect(() => {
    if (account && ethereum) {
      fetchLegacy(account, ethereum);
    }
  }, [account, ethereum, fetchLegacy, poolAddress]);

  useEffect(() => {
    const hasLegacyBalance = legacyLPStagedBalance.isGreaterThan(0) ||
      legacyESDClaimableBalance.isGreaterThan(0) || legacyLPBondedBalance.isGreaterThan(0);
    setHasLegacyBalance(hasLegacyBalance);
  }, [legacyLPStagedBalance, legacyESDClaimableBalance, legacyLPBondedBalance]);


  return (
    <Context.Provider
      value={{
        poolAddress,
        totalBonded,
        pairESDBalance,
        pairUSDCBalance,

        userUSDCAllowance,
        userLPAllowance,
        userLPStagedBalance,
        userLPBondedBalance,
        userESDClaimableBalance,
        userESDRewardedBalance,
        userStatus,
        userLockedUntil,

        hasLegacyBalance,
        legacyAddress,
        legacyLPStagedBalance,
        legacyLPBondedBalance,
        legacyESDClaimableBalance,
        legacyESDRewardedBalance,
        legacyStatus,

        onApprove: handleApprove,
        onDeposit: handleDeposit,
        onWithdraw: handleWithdraw,
        onBond: handleBond,
        onUnbond: handleUnbond,
        onClaim: handleClaim,
        onProvide: handleProvide,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
