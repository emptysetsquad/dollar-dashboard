import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {
  DataView, Button, IconRight, IconPlus
} from '@aragon/ui';

import {getBatchBalanceOfCoupons, getCouponEpochs} from '../../utils/infura';
import {ESD, ESDS} from "../../constants/tokens";
import {formatBN, toBaseUnitBN, toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import {redeemCoupons} from "../../utils/web3";

type PurchaseHistoryProps = {
  user: string,
  hideRedeemed: boolean,
  totalRedeemable: BigNumber
};

function PurchaseHistory({
  user, hideRedeemed, totalRedeemable
}: PurchaseHistoryProps) {
  const history = useHistory();
  const [epochs, setEpochs] = useState([]);
  const [page, setPage] = useState(0)
  const [initialized, setInitialized] = useState(false)

  //Update User balances
  useEffect(() => {
    if (user === '') return;
    let isCancelled = false;

    async function updateUserInfo() {
      const epochsFromEvents = await getCouponEpochs(ESDS.addr, user);
      const balanceOfCoupons = await getBatchBalanceOfCoupons(
        ESDS.addr,
        user,
        epochsFromEvents.map(e => parseInt(e.epoch)));

      const couponEpochs = epochsFromEvents.map((epoch, i) => {
        epoch.balance = new BigNumber(balanceOfCoupons[i]);
        return epoch;
      });


      if (!isCancelled) {
        // @ts-ignore
        setEpochs(couponEpochs);
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
  }, [user]);

  return (
    <DataView
      fields={['Epoch', 'Purchased', 'Balance', '']}
      status={ initialized ? 'default' : 'loading' }
      // @ts-ignore
      entries={hideRedeemed ? epochs.filter((epoch) => !epoch.balance.isZero()) : epochs}
      entriesPerPage={10}
      page={page}
      onPageChange={setPage}
      renderEntry={(epoch) => [
        epoch.epoch.toString(),
        formatBN(toTokenUnitsBN(epoch.coupons, ESD.decimals), 2),
        formatBN(toTokenUnitsBN(epoch.balance, ESD.decimals), 2),
        <>
          <Button
            icon={<IconPlus />}
            label="Redeem All"
            onClick={() => redeemCoupons(
              ESDS.addr,
              epoch.epoch,
              toBaseUnitBN(epoch.balance, ESD.decimals),
            )}
            disabled={epoch.balance.isZero() || epoch.balance.isGreaterThan(totalRedeemable)}
          />
          <Button
            icon={<IconRight />}
            label="Manage"
            onClick={() => {
              history.push(`/coupons/epoch/${epoch.epoch}`);
            }}
          />
        </>
      ]}
    />
  );
}

export default PurchaseHistory;
