import React, { useState } from 'react';
import {
  Box, Button, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { removeLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import { toBaseUnitBN } from '../../utils/number';
import {decreaseWithSlippage} from "../../utils/calculation";
import {ESD, UNI, USDC} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type RemoveLiquidityProps = {
  userBalanceUNI: BigNumber,
  pairBalanceESD: BigNumber,
  pairBalanceUSDC: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}


function RemoveLiquidity({
  userBalanceUNI,
  pairBalanceESD,
  pairBalanceUSDC,
  pairTotalSupplyUNI,
}: RemoveLiquidityProps) {
  const [withdrawAmountUNI, setWithdrawAmountUNI] = useState(new BigNumber(0));

  const poolPortion = withdrawAmountUNI.div(pairTotalSupplyUNI);
  const estimatedUSDCReceived = pairBalanceUSDC.times(poolPortion);
  const estimatedESDReceived = pairBalanceESD.times(poolPortion);

  const minUSDCReceived = decreaseWithSlippage(estimatedUSDCReceived);
  const minESDReceived = decreaseWithSlippage(estimatedESDReceived);

  const onChangeWithdrawAmountUNI = (amountUNI) => {
    if (!amountUNI) {
      setWithdrawAmountUNI(new BigNumber(0));
      return;
    }
    const amountUNIBN = new BigNumber(amountUNI);
    setWithdrawAmountUNI(amountUNIBN);
  };

  return (
    <Box heading="Remove Liquidity">
      <div style={{ display: 'flex' }}>
        {/* Pool Token in Hold */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="Pair Token Balance" balance={userBalanceUNI} />
        </div>
        {/* Remove */}
        <div style={{ width: '70%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <BigNumberInput
                adornment="UNI-V2"
                value={withdrawAmountUNI}
                setter={onChangeWithdrawAmountUNI}
              />
              <MaxButton
                onClick={() => setWithdrawAmountUNI(userBalanceUNI)}
              />
            </div>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <>
                <PriceSection label="You get " amt={estimatedUSDCReceived} symbol=" USDC" />
                <PriceSection label="+ " amt={estimatedESDReceived} symbol=" ESD" />
              </>
            </div>
            <div style={{ width: '30%' }}>
              <Button
                wide
                icon={<IconCircleMinus />}
                label="Remove Liquidity"
                onClick={() => {
                  removeLiquidity(
                    toBaseUnitBN(withdrawAmountUNI, UNI.decimals),
                    toBaseUnitBN(minESDReceived, ESD.decimals),
                    toBaseUnitBN(minUSDCReceived, USDC.decimals),
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

export default RemoveLiquidity;
