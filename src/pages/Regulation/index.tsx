import React from 'react';
import { Header } from '@aragon/ui';

import useCoupons from "../../hooks/useCoupons";
import useRegulation from "../../hooks/useRegulation";

import { IconHeader } from "../../components/common";
import RegulationHeader from "./Header";
import RegulationHistory from "./RegulationHistory";

function Regulation() {
  const {
    totalESDDebt,
    totalESDRedeemable,
    totalCouponsPremium,
    totalCouponsPrincipal,
    couponPremium,
  } = useCoupons();
  const {
    totalSupply,
    totalBonded,
    totalStaged,

    poolLiquidity,
    poolTotalRewarded,
    poolTotalClaimable,
    legacyPoolTotalRewarded,
    legacyPoolTotalClaimable,
  } = useRegulation();

  return (
    <>
      <IconHeader icon={<i className="fas fa-chart-area"/>} text="Supply Regulation"/>

      <RegulationHeader
        totalSupply={totalSupply}

        totalBonded={totalBonded}
        totalStaged={totalStaged}
        totalRedeemable={totalESDRedeemable}

        poolLiquidity={poolLiquidity}
        poolRewarded={poolTotalRewarded}
        poolClaimable={poolTotalClaimable}

        legacyPoolRewarded={legacyPoolTotalRewarded}
        legacyPoolClaimable={legacyPoolTotalClaimable}

        totalDebt={totalESDDebt}
        totalCoupons={totalCouponsPremium}
        totalCouponsUnderlying={totalCouponsPrincipal}
        couponPremium={couponPremium}
      />

      <Header primary="Regulation History" />

      <RegulationHistory />
    </>
  );
}

export default Regulation;
