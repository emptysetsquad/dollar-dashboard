import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {
  getTokenAllowance,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalDebt,
} from '../../utils/infura';
import {ESD, ESDS} from "../../constants/tokens";
import CouponMarketHeader from "./Header";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import PurchaseCoupons from "./PurchaseCoupons";
import PurchaseHistory from "./PurchaseHistory";
import IconHeader from "../common/IconHeader";

function CouponMarket({ user }: {user: string}) {

  const [balance, setBalance] = useState(new BigNumber(0));
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const [supply, setSupply] = useState(new BigNumber(0));
  const [debt, setDebt] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setBalance(new BigNumber(0));
      setAllowance(new BigNumber(0));
      setSupply(new BigNumber(0));
      setDebt(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [balanceStr, allowanceStr, supplyStr, debtStr] = await Promise.all([
        getTokenBalance(ESD.addr, user),
        getTokenAllowance(ESD.addr, user, ESDS.addr),
        getTokenTotalSupply(ESD.addr),
        getTotalDebt(ESDS.addr),
      ]);

      const userBalance = toTokenUnitsBN(balanceStr, ESD.decimals);
      const totalSupply = toTokenUnitsBN(supplyStr, ESD.decimals);
      const totalDebt = toTokenUnitsBN(debtStr, ESD.decimals);

      if (!isCancelled) {
        setBalance(new BigNumber(userBalance));
        setAllowance(new BigNumber(allowanceStr));
        setSupply(new BigNumber(totalSupply));
        setDebt(new BigNumber(totalDebt));
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
      <IconHeader icon={<i className="fas fa-ticket-alt"/>} text="Coupon Market"/>

      <Header primary="Coupon Market" />

      <CouponMarketHeader
        debt={debt}
        supply={supply}
      />

      <Header primary="Purchase Coupons" />

      <PurchaseCoupons
        user={user}
        allowance={allowance}
        balance={balance}
        debt={debt}
      />

      <Header primary="Purchase History" />

      <PurchaseHistory
        user={user}
      />
    </>
  );
}

export default CouponMarket;
