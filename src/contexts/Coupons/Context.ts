import { createContext } from "react";
import BigNumber from "bignumber.js";
import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
  totalESDDebt: new BigNumber(0),
  totalESDRedeemable: new BigNumber(0),
  totalCouponsPremium: new BigNumber(0),
  totalCouponsPrincipal: new BigNumber(0),
  couponPremium: new BigNumber(0),

  userCoupons: [],

  onPurchase: () => {},
  onRedeem: () => {},
  onMigrate: () => {},
});

export default Context;
