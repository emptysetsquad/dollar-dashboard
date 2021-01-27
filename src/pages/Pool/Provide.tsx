import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box, Button, IconArrowUp, IconCirclePlus
} from '@aragon/ui';

import useBalances from "../../hooks/useBalances";
import usePool from "../../hooks/usePool";
import { isPos, toBaseUnitBN, toTokenUnitsBN } from '../../utils/number';
import { ESD, USDC } from "../../constants/tokens";
import { MAX_UINT256 } from "../../constants/values";

import {
  BalanceBlock, MaxButton, PriceSection, BigNumberInput
} from '../../components/common';

type ProvideProps = {
  user: string,
};

function Provide({ user }: ProvideProps) {
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0));

  const { userUSDCFreeBalance } = useBalances();
  const {
    poolAddress,
    pairESDBalance,
    pairUSDCBalance,

    userUSDCAllowance,
    userESDRewardedBalance,
    userStatus,

    onApprove,
    onProvide
  } = usePool();

  const USDCToESDRatio = pairUSDCBalance.isZero() ? new BigNumber(1) : pairUSDCBalance.div(pairESDBalance);

  const isRewardedNegative = userESDRewardedBalance.isGreaterThan(new BigNumber("1000000000000000000"));
  const rewarded = isRewardedNegative ? new BigNumber(0) : userESDRewardedBalance;

  const onChangeAmountESD = (amountESD) => {
    if (!amountESD) {
      setProvideAmount(new BigNumber(0));
      setUsdcAmount(new BigNumber(0));
      return;
    }

    const amountESDBN = new BigNumber(amountESD)
    setProvideAmount(amountESDBN);

    const amountESDBU = toBaseUnitBN(amountESDBN, ESD.decimals);
    const newAmountUSDC = toTokenUnitsBN(
      amountESDBU.multipliedBy(USDCToESDRatio).integerValue(BigNumber.ROUND_FLOOR),
      ESD.decimals);
    setUsdcAmount(newAmountUSDC);
  };

  return (
    <Box heading="Provide">
      {userUSDCAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"ESD"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset="USDC Balance" balance={userUSDCFreeBalance} suffix={"USDC"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Provide liquidity using Pool rewards */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="ESD"
                    value={provideAmount}
                    setter={onChangeAmountESD}
                    disabled={userStatus === 1}
                  />
                  <PriceSection label="Requires " amt={usdcAmount} symbol=" USDC"/>
                  <MaxButton
                    onClick={() => {
                      onChangeAmountESD(rewarded);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '6em'}}>
                <Button
                  wide
                  icon={<IconArrowUp/>}
                  label="Provide"
                  onClick={() => {
                    onProvide(
                      provideAmount,
                      (hash) => setProvideAmount(new BigNumber(0))
                    );
                  }}
                  disabled={poolAddress === '' || userStatus !== 0 ||
                    !isPos(provideAmount) || usdcAmount.isGreaterThan(userUSDCFreeBalance)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"ESD"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset="USDC Balance" balance={userUSDCFreeBalance} suffix={"USDC"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Approve Pool to spend USDC */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Approve"
              onClick={() => {onApprove(USDC.addr)}}
              disabled={poolAddress === '' || user === ''}
            />
          </div>
        </div>
      }
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}> Zap your rewards directly to LP by providing more USDC </span>
      </div>
    </Box>
  );
}

export default Provide;
