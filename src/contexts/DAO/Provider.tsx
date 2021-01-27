import React, { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import Context from "./Context";

import {
  getEpoch,
  getEpochTime,
  getTokenTotalSupply,
  getTokenAllowance,
  getTokenBalance,
  getBalanceOfStaged,
  getBalanceBonded,
  getStatusOf,
  getFluidUntil,
  getLockedUntil,
} from '../../utils/infura';
import {
  advance,
  approve,
  deposit,
  withdraw,
  bond,
  unbondUnderlying
} from '../../utils/web3';
import { ESD, ESDS } from "../../constants/tokens";
import { toTokenUnitsBN, toBaseUnitBN } from '../../utils/number';

const Provider: React.FC = ({ children }) => {
  const [epoch, setEpoch] = useState(0);
  const [epochTime, setEpochTime] = useState(0);
  const [totalESDSSupply, setTotalESDSSupply] = useState(new BigNumber(0));

  const [userESDAllowance, setUserESDAllowance] = useState(new BigNumber(0));
  const [userESDStagedBalance, setUserESDStagedBalance] = useState(new BigNumber(0));
  const [userESDBondedBalance, setUserESDBondedBalance] = useState(new BigNumber(0));
  const [userESDSBalance, setUserESDSBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userLockedUntil, setUserLockedUntil] = useState(0);

  const { account, ethereum }: { account: string | null; ethereum: provider } = useWallet();

  const fetchData = useCallback(
    async (provider: provider) => {
      const data = await Promise.all([
        getEpoch(ESDS.addr),
        getEpochTime(ESDS.addr),
        getTokenTotalSupply(ESDS.addr),
      ]);

      setEpoch(parseInt(data[0], 10));
      setEpochTime(parseInt(data[1], 10));
      setTotalESDSSupply(toTokenUnitsBN(data[2], ESDS.decimals));
    },
    [setEpoch, setEpochTime, setTotalESDSSupply]
  );

  const fetchUserData = useCallback(
    async (userAddress: string, provider: provider) => {
      const data = await Promise.all([
        getTokenAllowance(ESD.addr, userAddress, ESDS.addr),
        getBalanceOfStaged(ESDS.addr, userAddress),
        getBalanceBonded(ESDS.addr, userAddress),
        getTokenBalance(ESDS.addr, userAddress),
        getStatusOf(ESDS.addr, userAddress),
        getFluidUntil(ESDS.addr, userAddress),
        getLockedUntil(ESDS.addr, userAddress),
      ]);

      setUserESDAllowance(new BigNumber(data[0]));
      setUserESDStagedBalance(toTokenUnitsBN(data[1], ESD.decimals));
      setUserESDBondedBalance(toTokenUnitsBN(data[2], ESD.decimals));
      setUserESDSBalance(toTokenUnitsBN(data[3], ESDS.decimals));
      setUserStatus(parseInt(data[4], 10));

      const fluidUntil = parseInt(data[5], 10);
      const lockedUntil = parseInt(data[6], 10);
      setUserLockedUntil(Math.max(fluidUntil, lockedUntil));
    },
    [setUserESDAllowance, setUserESDStagedBalance, setUserESDBondedBalance,
     setUserESDSBalance, setUserStatus, setUserLockedUntil]
  );

  const handleAdvance = useCallback(async () => {
    advance(ESDS.addr);
  }, []);

  const handleApprove = useCallback(async () => {
    approve(ESD.addr, ESDS.addr);
  }, []);

  const handleDeposit = useCallback(async (amount: BigNumber) => {
    deposit(
      ESDS.addr,
      toBaseUnitBN(amount, ESD.decimals),
    );
  }, []);

  const handleWithdraw = useCallback(async (amount: BigNumber) => {
    withdraw(
      ESDS.addr,
      toBaseUnitBN(amount, ESD.decimals),
    );
  }, []);

  const handleBond = useCallback(async (amount: BigNumber) => {
    bond(
      ESDS.addr,
      toBaseUnitBN(amount, ESD.decimals),
    );
  }, []);

  const handleUnbond = useCallback(async (amount: BigNumber) => {
    unbondUnderlying(
      ESDS.addr,
      toBaseUnitBN(amount, ESD.decimals),
    );
  }, []);

  useEffect(() => {
    if (ethereum) {
      fetchData(ethereum);
      let refreshInterval = setInterval(() => fetchData(ethereum), 15000);
      return () => clearInterval(refreshInterval);
    }
  }, [ethereum, fetchData]);

  useEffect(() => {
    if (account && ethereum) {
      fetchUserData(account, ethereum);
      let refreshInterval = setInterval(() => fetchUserData(account, ethereum), 15000);
      return () => clearInterval(refreshInterval);
    }
  }, [account, ethereum, fetchUserData]);

  return (
    <Context.Provider
      value={{
        epoch,
        epochTime,
        totalESDSSupply,

        userESDAllowance,
        userESDStagedBalance,
        userESDBondedBalance,
        userESDSBalance,
        userStatus,
        userLockedUntil,

        onAdvance: handleAdvance,
        onApprove: handleApprove,
        onDeposit: handleDeposit,
        onWithdraw: handleWithdraw,
        onBond: handleBond,
        onUnbond: handleUnbond,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
