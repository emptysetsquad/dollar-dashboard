import React, { useState } from 'react';
import { useWallet } from 'use-wallet';
import { Header } from '@aragon/ui';

import useDAO from "../../hooks/useDAO";
import useCoupons from "../../hooks/useCoupons";
import { getPreference, storePreference } from "../../utils/storage";

import {CheckBox, IconHeader} from "../../components/common";
import CouponMarketHeader from "./Header";
import PurchaseCoupons from "./PurchaseCoupons";
import PurchaseHistory from "./PurchaseHistory";
import ModalWarning from "./ModalWarning";

function CouponMarket() {
  const { account } = useWallet();
  const { totalESDSSupply } = useDAO();
  const {
    totalESDDebt,
    totalESDRedeemable,
    totalCouponsPremium,
    totalCouponsPrincipal,
    couponPremium,
  } = useCoupons();

  const storedHideRedeemed = getPreference('hideRedeemedCoupons', '0');
  const [hideRedeemed, setHideRedeemed] = useState(storedHideRedeemed === '1');

  const totalCoupons = totalCouponsPrincipal.plus(totalCouponsPremium);

  return (
    <>
      <ModalWarning/>

      <IconHeader icon={<i className="fas fa-ticket-alt"/>} text="Coupon Market"/>

      <CouponMarketHeader
        debt={totalESDDebt}
        supply={totalESDSSupply}
        coupons={totalCoupons}
        premium={couponPremium}
        redeemable={totalESDRedeemable}
      />

      <Header primary="Purchase" />

      <PurchaseCoupons user={account || ''} />

      <div style={{ display: 'flex' }}>
        <Header primary="Coupons" />
        <div style={{ marginLeft: 'auto', alignSelf: 'flex-end' }}>
          <CheckBox
            text="Hide Redeemed"
            onCheck={(checked) => {
              storePreference('hideRedeemedCoupons', checked ? '1' : '0');
              setHideRedeemed(checked);
            }}
            checked={hideRedeemed}
          />
        </div>
      </div>

      <PurchaseHistory
        user={account || ''}
        hideRedeemed={hideRedeemed}
        totalRedeemable={totalESDRedeemable}
      />
    </>
  );
}

export default CouponMarket;
