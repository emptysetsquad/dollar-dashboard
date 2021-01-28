import React, { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import Context from "./Context";
import { Coupon } from "./types";

import {
  getTotalDebt,
  getTotalRedeemable,
  getTotalCoupons,
  getTotalCouponsUnderlying,
  getCouponPremium,
  getBatchBalanceOfCoupons,
  getBatchBalanceOfCouponsUnderlying,
  getBatchCouponsExpiration,
  getCouponEpochs,
} from '../../utils/infura';
import { purchaseCoupons, redeemCoupons, migrateCoupons } from "../../utils/web3";
import { ESD, ESDS } from "../../constants/tokens";
import { toTokenUnitsBN, toBaseUnitBN } from '../../utils/number';

const ONE_COUPON = new BigNumber(10).pow(18);

const Provider: React.FC = ({ children }) => {
  const [totalESDDebt, setTotalESDDebt] = useState(new BigNumber(0));
  const [totalESDRedeemable, setTotalESDRedeemable] = useState(new BigNumber(0));
  const [totalCouponsPrincipal, setTotalCouponsPrincipal] = useState(new BigNumber(0));
  const [totalCouponsPremium, setTotalCouponsPremium] = useState(new BigNumber(0));
  const [couponPremium, setCouponPremium] = useState(new BigNumber(0));

  const [userCoupons, setUserCoupons] = useState<Coupon[]>([]);

  const { account, ethereum }: { account: string | null; ethereum: provider } = useWallet();

  const fetchData = useCallback(
    async (provider: provider) => {
      const data = await Promise.all([
        getTotalDebt(ESDS.addr),
        getTotalRedeemable(ESDS.addr),
        getTotalCoupons(ESDS.addr),
        getTotalCouponsUnderlying(ESDS.addr),
      ]);

      const debt = toTokenUnitsBN(data[0], ESD.decimals);
      setTotalESDDebt(debt);
      setTotalESDRedeemable(toTokenUnitsBN(data[1], ESD.decimals));
      setTotalCouponsPremium(toTokenUnitsBN(data[2], ESD.decimals));
      setTotalCouponsPrincipal(toTokenUnitsBN(data[3], ESD.decimals));

      if (debt.isGreaterThan(new BigNumber(1))) {
        const premium = await getCouponPremium(ESDS.addr, ONE_COUPON);
        setCouponPremium(toTokenUnitsBN(premium, ESD.decimals));
      } else {
        setCouponPremium(new BigNumber(0));
      }
    },
    [setTotalESDDebt, setTotalESDRedeemable, setTotalCouponsPremium,
     setTotalCouponsPrincipal, setCouponPremium]
  );

  const fetchUserData = useCallback(
    async (userAddress: string, provider: provider) => {
      const epochsFromEvents = await getCouponEpochs(ESDS.addr, userAddress);
      const epochNumbers = epochsFromEvents.map(e => parseInt(e.epoch));

      const [premiums, principals, expirations] = await Promise.all([
        getBatchBalanceOfCoupons(ESDS.addr, userAddress, epochNumbers),
        getBatchBalanceOfCouponsUnderlying(ESDS.addr, userAddress, epochNumbers),
        getBatchCouponsExpiration(ESDS.addr, epochNumbers),
      ]);

      const couponEpochs = epochsFromEvents.map((epoch, i) => {
        epoch.principal = new BigNumber(principals[i]);
        epoch.premium = new BigNumber(premiums[i]);
        epoch.expiration = expirations[i];
        return epoch;
      });

      setUserCoupons(couponEpochs);
    },
    [setUserCoupons]
  );

  const handlePurchase = useCallback(async (amount: BigNumber) => {
    purchaseCoupons(
      ESDS.addr,
      toBaseUnitBN(amount, ESD.decimals),
    );
  }, []);

  const handleRedeem = useCallback(async (epoch: number, amount: BigNumber) => {
    redeemCoupons(
      ESDS.addr,
      epoch,
      amount,
    );
  }, []);

  const handleMigrate = useCallback(async (epoch: number) => {
    migrateCoupons(
      ESDS.addr,
      epoch,
    );
  }, []);

  useEffect(() => {
    if (ethereum) {
      fetchData(ethereum);
      let refreshInterval = setInterval(() => fetchData(ethereum), 15000);
      return () => clearInterval(refreshInterval);
    }
  }, [account, ethereum, fetchData]);

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
        totalESDDebt,
        totalESDRedeemable,
        totalCouponsPremium,
        totalCouponsPrincipal,
        couponPremium,

        userCoupons,

        onPurchase: handlePurchase,
        onRedeem: handleRedeem,
        onMigrate: handleMigrate,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
