import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconBlank
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton,
} from '../common/index';
import {redeemCoupons} from '../../utils/web3';

import {isPos, toBaseUnitBN} from '../../utils/number';
import {ESD, ESDS} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type RedeemCouponsProps = {
  user: string,
  epoch: number,
  balance: BigNumber,
  redeemable: BigNumber,
};

function RedeemCoupons({
  user, epoch, balance, redeemable,
}: RedeemCouponsProps) {
  const [redeemAmount, setRedeemAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Redeem">
      <div style={{display: 'flex'}}>
        {/* User balance */}
        <div style={{width: '30%'}}>
          <BalanceBlock asset={`Coupon Balance`} balance={balance}/>
        </div>
        <div style={{width: '38%'}}/>
        {/* Redeem coupons */}
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <>
                <BigNumberInput
                  adornment={<IconBlank/>}
                  value={redeemAmount}
                  setter={setRedeemAmount}
                />
                <MaxButton
                  onClick={() => {
                    const maxRedeemAmount = redeemable.comparedTo(balance) > 0 ? balance : redeemable
                    setRedeemAmount(maxRedeemAmount);
                  }}
                />
              </>
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconCirclePlus/>}
                label="Redeem"
                onClick={() => {
                  redeemCoupons(
                    ESDS.addr,
                    epoch,
                    toBaseUnitBN(redeemAmount, ESD.decimals),
                  );
                }}
                disabled={user === '' || redeemable.isZero() || balance.isZero() || !isPos(redeemAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default RedeemCoupons;
