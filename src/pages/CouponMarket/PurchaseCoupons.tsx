import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box, Button, IconCirclePlus, IconCircleMinus
} from '@aragon/ui';

import useBalances from "../../hooks/useBalances";
import useCoupons from "../../hooks/useCoupons";
import useDAO from "../../hooks/useDAO";

import {
  BalanceBlock, MaxButton, PriceSection, BigNumberInput,
} from '../../components/common/index';

import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {ESD, ESDS} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import {getCouponPremium} from "../../utils/infura";

type PurchaseCouponsProps = {
  user: string,
};

function PurchaseCoupons({ user }: PurchaseCouponsProps) {
  const [purchaseAmount, setPurchaseAmount] = useState(new BigNumber(0));
  const [premium, setPremium] = useState(new BigNumber(0));

  const { userESDFreeBalance } = useBalances();
  const { userESDAllowance, onApprove } = useDAO();
  const { totalESDDebt, onPurchase } = useCoupons();

  const updatePremium = async (purchaseAmount) => {
    if (purchaseAmount.lte(new BigNumber(0))) {
      setPremium(new BigNumber(0));
      return;
    }
    const purchaseAmountBase = toBaseUnitBN(purchaseAmount, ESD.decimals);
    const premium = await getCouponPremium(ESDS.addr, purchaseAmountBase)
    const premiumFormatted = toTokenUnitsBN(premium, ESD.decimals);
    setPremium(premiumFormatted);
  };

  return (
    <Box heading="Purchase">
      {userESDAllowance.comparedTo(MAX_UINT256) === 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* User balance */}
          <div style={{flexBasis: '30%'}}>
            <BalanceBlock asset={`Balance`} balance={userESDFreeBalance} suffix={" ESD"}/>
          </div>
          <div style={{flexBasis: '38%'}}/>
          {/* Purchase coupons */}
          <div style={{flexBasis: '32%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="ESD"
                    value={purchaseAmount}
                    setter={(value) => {
                      setPurchaseAmount(value);
                      isPos(value) ? updatePremium(value) : updatePremium(new BigNumber(0));
                    }}
                  />
                  <MaxButton
                    onClick={() => {
                      const maxPurchaseAmount = totalESDDebt.comparedTo(userESDFreeBalance) > 0 ? userESDFreeBalance : totalESDDebt;
                      setPurchaseAmount(maxPurchaseAmount);
                      updatePremium(maxPurchaseAmount);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '6em'}}>
                <Button
                  wide
                  icon={<IconCircleMinus/>}
                  label="Burn"
                  onClick={() => {onPurchase(purchaseAmount)}}
                  disabled={user === '' || totalESDDebt.isZero() || userESDFreeBalance.isZero() || !isPos(purchaseAmount)}
                />
              </div>
            </div>
            <PriceSection label="Coupons " amt={purchaseAmount.plus(premium)}/>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* User balance */}
          <div style={{flexBasis: '30%'}}>
            <BalanceBlock asset={`Døllar Balance`} balance={userESDFreeBalance}/>
          </div>
          <div style={{flexBasis: '40%'}}/>
          {/* Approve DAO to spend Døllar */}
          <div style={{flexBasis: '30%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Approve"
              onClick={onApprove}
              disabled={user === ''}
            />
          </div>
        </div>
      }
    </Box>
  );
}

export default PurchaseCoupons;
