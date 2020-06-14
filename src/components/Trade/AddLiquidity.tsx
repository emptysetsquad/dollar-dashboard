import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Button, IconCirclePlus } from '@aragon/ui';
import { addLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {ESD, UNI, USDC} from "../../constants/tokens";
import {SLIPPAGE} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type AddliquidityProps = {
  userBalanceESD: BigNumber,
  userBalanceUSDC: BigNumber,
  pairBalanceESD: BigNumber,
  pairBalanceUSDC: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}

function AddLiquidity({
  userBalanceESD,
  userBalanceUSDC,
  pairBalanceESD,
  pairBalanceUSDC,
  pairTotalSupplyUNI,
}: AddliquidityProps) {
  const [amountUSDC, setAmountUSDC] = useState(new BigNumber(0));
  const [amountESD, setAmountESD] = useState(new BigNumber(0));
  const [amountUNI, setAmountUNI] = useState(new BigNumber(0));

  const USDCToESDRatio = pairBalanceUSDC.isZero() ? new BigNumber(1) : pairBalanceUSDC.div(pairBalanceESD);
  const ESDToUSDCRatio = pairBalanceESD.isZero() ? new BigNumber(1) : pairBalanceESD.div(pairBalanceUSDC);

  const onChangeAmountUSDC = (amountUSDC) => {
    if (!amountUSDC) {
      setAmountESD(new BigNumber(0));
      setAmountUSDC(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountUSDCBN = new BigNumber(amountUSDC)
    setAmountUSDC(amountUSDCBN);

    const amountUSDCBU = toBaseUnitBN(amountUSDCBN, USDC.decimals);
    const newAmountESD = toTokenUnitsBN(
      amountUSDCBU.multipliedBy(ESDToUSDCRatio).integerValue(BigNumber.ROUND_FLOOR),
      USDC.decimals);
    setAmountESD(newAmountESD);

    const newAmountESDBU = toBaseUnitBN(newAmountESD, ESD.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceESDBU = toBaseUnitBN(pairBalanceESD, ESD.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountESDBU).div(pairBalanceESDBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  const onChangeAmountESD = (amountESD) => {
    if (!amountESD) {
      setAmountESD(new BigNumber(0));
      setAmountUSDC(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountESDBN = new BigNumber(amountESD)
    setAmountESD(amountESDBN);

    const amountESDBU = toBaseUnitBN(amountESDBN, ESD.decimals);
    const newAmountUSDC = toTokenUnitsBN(
      amountESDBU.multipliedBy(USDCToESDRatio).integerValue(BigNumber.ROUND_FLOOR),
      ESD.decimals);
    setAmountUSDC(newAmountUSDC);

    const newAmountUSDCBU = toBaseUnitBN(newAmountUSDC, USDC.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceUSDCBU = toBaseUnitBN(pairBalanceUSDC, USDC.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountUSDCBU).div(pairBalanceUSDCBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  return (
    <Box heading="Add Liquidity">
      <div style={{ display: 'flex' }}>
        {/* Pool Status */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="USDC Balance" balance={userBalanceUSDC} />
        </div>
        {/* Add liquidity to pool */}
        <div style={{ width: '70%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <>
                <BigNumberInput
                  adornment="ESD"
                  value={amountESD}
                  setter={onChangeAmountESD}
                />
                <MaxButton
                  onClick={() => {
                    onChangeAmountESD(userBalanceESD);
                  }}
                />
              </>
            </div>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <BigNumberInput
                adornment="USDC"
                value={amountUSDC}
                setter={onChangeAmountUSDC}
              />
              <PriceSection label="Mint " amt={amountUNI} symbol=" Pool Tokens" />
            </div>
            <div style={{ width: '30%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Add Liquidity"
                onClick={() => {
                  const amountESDBU = toBaseUnitBN(amountESD, ESD.decimals);
                  const amountUSDCBU = toBaseUnitBN(amountUSDC, USDC.decimals);
                  addLiquidity(
                    amountESDBU,
                    amountUSDCBU,
                    SLIPPAGE,
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}


export default AddLiquidity;
