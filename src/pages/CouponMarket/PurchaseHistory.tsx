import React, { useState } from 'react';
import BigNumber from "bignumber.js";
import {
  DataView, Button, IconCirclePlus, IconRefresh, IconCheck, IconLock
} from '@aragon/ui';

import useCoupons from "../../hooks/useCoupons";
import { ESD } from "../../constants/tokens";
import { formatBN, toBaseUnitBN, toTokenUnitsBN } from "../../utils/number";

type PurchaseHistoryProps = {
  user: string,
  hideRedeemed: boolean,
  totalRedeemable: BigNumber
};

function PurchaseHistory({
  user, hideRedeemed, totalRedeemable
}: PurchaseHistoryProps) {
  const [page, setPage] = useState(0)

  const { userCoupons } = useCoupons();
  const initialized = userCoupons.length > 0;

  return (
    <DataView
      fields={['Epoch', 'Purchased', 'Principal', 'Premium', 'Expires', '']}
      status={ initialized ? 'default' : 'loading' }
      // @ts-ignore
      entries={hideRedeemed ? userCoupons.filter((epoch) => !epoch.principal.isZero() || !epoch.premium.isZero()) : userCoupons}
      entriesPerPage={10}
      page={page}
      onPageChange={setPage}
      renderEntry={(epoch) => [
        epoch.epoch.toString(),
        formatBN(toTokenUnitsBN(epoch.coupons, ESD.decimals), 2),
        formatBN(toTokenUnitsBN(epoch.principal, ESD.decimals), 2),
        formatBN(toTokenUnitsBN(epoch.premium, ESD.decimals), 2),
        epoch.expiration.toString(),
        <CouponAction coupon={epoch} totalRedeemable={totalRedeemable} />
      ]}
    />
  );
}

type CouponActionProps = {
  coupon: any,
  totalRedeemable: BigNumber
}

function CouponAction({coupon, totalRedeemable}:CouponActionProps) {
  const { onRedeem, onMigrate } = useCoupons();

  return (
    <>
    {/* pre-EIP-16 style coupons */
     coupon.principal.isZero() && !coupon.premium.isZero() ?
      <Button
        icon={<IconRefresh />}
        label="Migrate"
        onClick={() => onMigrate(coupon.epoch)}
      />
      /* already redeemed coupons */
      : coupon.principal.isZero() ?
      <Button
        icon={<IconCheck />}
        label="Redeemed"
        disabled={true}
      />
      /* redeemable coupons */
      :
      <Button
        icon={totalRedeemable.isZero() ? <IconLock /> : <IconCirclePlus />}
        label="Redeem"
        onClick={() => onRedeem(
          coupon.epoch,
          coupon.principal.isGreaterThan(toBaseUnitBN(totalRedeemable, ESD.decimals))
            ? toBaseUnitBN(totalRedeemable, ESD.decimals)
            : coupon.principal
        )}
        disabled={totalRedeemable.isZero()}
      />
    }
    </>
  );
}

export default PurchaseHistory;
