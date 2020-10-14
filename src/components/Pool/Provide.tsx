import React, { useState } from 'react';
import {
  Box, Button, IconArrowUp, IconCirclePlus
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {approve, providePool} from '../../utils/web3';
import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {ESD, USDC} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import BigNumberInput from "../common/BigNumberInput";

type ProvideProps = {
  poolAddress: string,
  user: string,
  rewarded: BigNumber,
  pairBalanceESD: BigNumber,
  pairBalanceUSDC: BigNumber,
  userUSDCBalance: BigNumber,
  userUSDCAllowance: BigNumber,
  status: number,
};

function Provide({
  poolAddress, user, rewarded, pairBalanceESD, pairBalanceUSDC, userUSDCBalance, userUSDCAllowance, status
}: ProvideProps) {
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0));

  const USDCToESDRatio = pairBalanceUSDC.isZero() ? new BigNumber(1) : pairBalanceUSDC.div(pairBalanceESD);

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
        <div style={{display: 'flex'}}>
          {/* total rewarded */}
          <div style={{width: '30%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"ESD"} />
          </div>
          <div style={{width: '30%'}}>
            <BalanceBlock asset="USDC Balance" balance={userUSDCBalance} suffix={"USDC"} />
          </div>
          <div style={{width: '8%'}}/>
          {/* Provide liquidity using Pool rewards */}
          <div style={{width: '32%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%'}}>
                <>
                  <BigNumberInput
                    adornment="ESD"
                    value={provideAmount}
                    setter={onChangeAmountESD}
                    disabled={status === 1}
                  />
                  <PriceSection label="Requires " amt={usdcAmount} symbol=" USDC"/>
                  <MaxButton
                    onClick={() => {
                      onChangeAmountESD(rewarded);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%'}}>
                <Button
                  wide
                  icon={<IconArrowUp/>}
                  label="Provide"
                  onClick={() => {
                    providePool(
                      poolAddress,
                      toBaseUnitBN(provideAmount, ESD.decimals),
                      (hash) => setProvideAmount(new BigNumber(0))
                    );
                  }}
                  disabled={poolAddress === '' || status === 1 || !isPos(provideAmount) || usdcAmount.isGreaterThan(userUSDCBalance)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex'}}>
          {/* total rewarded */}
          <div style={{width: '30%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"ESD"} />
          </div>
          <div style={{width: '30%'}}>
            <BalanceBlock asset="USDC Balance" balance={userUSDCBalance} suffix={"USDC"} />
          </div>
          <div style={{width: '8%'}}/>
          {/* Approve Pool to spend USDC */}
          <div style={{width: '30%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Unlock"
              onClick={() => {
                approve(USDC.addr, poolAddress);
              }}
              disabled={poolAddress === '' || user === ''}
            />
          </div>
        </div>
      }
    </Box>
  );
}

export default Provide;
