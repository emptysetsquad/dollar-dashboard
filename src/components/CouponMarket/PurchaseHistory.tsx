import React, {useEffect, useState} from 'react';
import {
  DataView, Button, IconCirclePlus, IconRefresh, IconCheck, IconLock
} from '@aragon/ui';

import {
  getEpoch,
  getBatchBalanceOfCoupons, getBatchBalanceOfCouponsUnderlying,
  getBatchCouponsExpiration, getCouponEpochs
} from '../../utils/infura';
import {ESD, ESDS} from "../../constants/tokens";
import {formatBN, toBaseUnitBN, toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import { redeemCoupons, migrateCoupons } from "../../utils/web3";

type PurchaseHistoryProps = {
  user: string,
  hideRedeemed: boolean,
  totalRedeemable: BigNumber
};

function PurchaseHistory({
  user, hideRedeemed, totalRedeemable
}: PurchaseHistoryProps) {
  const [epochs, setEpochs] = useState([]);
  const [page, setPage] = useState(0)
  const [initialized, setInitialized] = useState(false)
  const [currentEpoch, setCurrentEpoch] = useState(0);

  //Update User balances
  useEffect(() => {
    if (user === '') return;
    let isCancelled = false;

    async function updateUserInfo() {
      const epochStr = await getEpoch(ESDS.addr);
      const epochsFromEvents = await getCouponEpochs(ESDS.addr, user);
      const epochNumbers = epochsFromEvents.map(e => parseInt(e.epoch));
      const balanceOfCouponsPremium = await getBatchBalanceOfCoupons(ESDS.addr, user, epochNumbers);
      const balanceOfCouponsPrincipal = await getBatchBalanceOfCouponsUnderlying(ESDS.addr, user, epochNumbers);
      const couponsExpirations = await getBatchCouponsExpiration(ESDS.addr, epochNumbers);

      const couponEpochs = epochsFromEvents.map((epoch, i) => {
        epoch.principal = new BigNumber(balanceOfCouponsPrincipal[i]);
        epoch.premium = new BigNumber(balanceOfCouponsPremium[i]);
        epoch.expiration = couponsExpirations[i];
        return epoch;
      });

      if (!isCancelled) {
        // @ts-ignore
        setEpochs(couponEpochs);
        setCurrentEpoch(parseInt(epochStr, 10));
        setInitialized(true);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, totalRedeemable]);

  return (
    <DataView
      fields={['Epoch', 'Purchased', 'Principal', 'Premium', 'Expires', '']}
      status={ initialized ? 'default' : 'loading' }
      // @ts-ignore
      entries={hideRedeemed ? epochs.filter((epoch) => !epoch.principal.isZero() || !epoch.premium.isZero()) : epochs}
      entriesPerPage={10}
      page={page}
      onPageChange={setPage}
      renderEntry={(epoch) => [
        epoch.epoch.toString(),
        formatBN(toTokenUnitsBN(epoch.coupons, ESD.decimals), 2),
        formatBN(toTokenUnitsBN(epoch.principal, ESD.decimals), 2),
        formatBN(toTokenUnitsBN(epoch.premium, ESD.decimals), 2),
        epoch.expiration.toString(),
        <CouponAction epoch={currentEpoch} coupon={epoch} totalRedeemable={totalRedeemable} />
      ]}
    />
  );
}

type CouponActionProps = {
  epoch: number,
  coupon: any,
  totalRedeemable: BigNumber
}

function CouponAction({epoch, coupon, totalRedeemable}:CouponActionProps) {
  const isRedeemable = !totalRedeemable.isZero() || (coupon.expiration < epoch);

  return (
    <>
    {/* pre-EIP-16 style coupons */
     coupon.principal.isZero() && !coupon.premium.isZero() ?
      <Button
        icon={<IconRefresh />}
        label="Migrate"
        onClick={() => migrateCoupons(ESDS.addr, coupon.epoch)}
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
        icon={isRedeemable ? <IconCirclePlus /> : <IconLock />}
        label="Redeem"
        onClick={() => redeemCoupons(
          ESDS.addr,
          coupon.epoch,
          !totalRedeemable.isZero() && coupon.principal.isGreaterThan(toBaseUnitBN(totalRedeemable, ESD.decimals))
            ? toBaseUnitBN(totalRedeemable, ESD.decimals)
            : coupon.principal
        )}
        disabled={!isRedeemable}
      />
    }
    </>
  );
}

export default PurchaseHistory;
