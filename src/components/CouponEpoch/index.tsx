import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';
import { useParams } from 'react-router-dom';

import {
  getBalanceOfCoupons,
  getOutstandingCoupons,
  getTotalRedeemable,
} from '../../utils/infura';
import {ESD, ESDS} from "../../constants/tokens";
import CouponMarketHeader from "./Header";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import RedeemCoupons from "./RedeemCoupons";
import IconHeader from "../common/IconHeader";

function CouponEpoch({ user }: {user: string}) {
  const { epoch } = useParams();

  const [redeemable, setRedeemable] = useState(new BigNumber(0));
  const [outstandingCouponForEpoch, setOutstandingCouponForEpoch] = useState(new BigNumber(0));
  const [userCouponBalance, setUserCouponBalance] = useState(new BigNumber(0));

  useEffect(() => {
    if (user === '') {
      setUserCouponBalance(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [balanceStr] = await Promise.all([
        getBalanceOfCoupons(ESDS.addr, user, epoch)
      ]);

      const couponBalance = toTokenUnitsBN(balanceStr, ESD.decimals);

      if (!isCancelled) {
        setUserCouponBalance(new BigNumber(couponBalance));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, epoch]);

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [redeemableStr, outstandingStr] = await Promise.all([
        getTotalRedeemable(ESDS.addr),
        getOutstandingCoupons(ESDS.addr, epoch),
      ]);

      const totalRedeemable = toTokenUnitsBN(redeemableStr, ESD.decimals);
      const outstandingCoupons = toTokenUnitsBN(outstandingStr, ESD.decimals);

      if (!isCancelled) {
        setRedeemable(new BigNumber(totalRedeemable));
        setOutstandingCouponForEpoch(new BigNumber(outstandingCoupons));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [epoch]);

  return (
    <>
      <IconHeader icon={<i className="fas fa-ticket-alt"/>} text={`Coupons for epoch ${epoch}`}/>

      <CouponMarketHeader
        redeemable={redeemable}
        outstanding={outstandingCouponForEpoch}
        balance={userCouponBalance}
      />

      <Header primary="Redeem Coupons" />

      <RedeemCoupons
        user={user}
        epoch={epoch}
        balance={userCouponBalance}
        redeemable={redeemable}
      />
    </>
  );
}

export default CouponEpoch;
