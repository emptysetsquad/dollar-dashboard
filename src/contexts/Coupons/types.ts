import BigNumber from "bignumber.js";

export interface ContextValues {
  totalESDDebt: BigNumber;
  totalESDRedeemable: BigNumber;
  totalCouponsPremium: BigNumber;
  totalCouponsPrincipal: BigNumber;
  couponPremium: BigNumber;

  userCoupons: Coupon[],

  onPurchase: (amount: BigNumber) => void;
  onRedeem: (epoch: number, amount: BigNumber) => void;
  onMigrate: (epoch: number) => void;
}

export type Coupon = {
  principal: BigNumber;
  premium: BigNumber;
  expiration: number;
}
