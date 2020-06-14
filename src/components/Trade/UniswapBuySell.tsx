import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {buyESD, sellESD} from '../../utils/web3';

import { getCost, getProceeds } from '../../utils/infura';


import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {ESD, USDC} from "../../constants/tokens";
import {decreaseWithSlippage, increaseWithSlippage} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type UniswapBuySellProps = {
  userBalanceESD: BigNumber,
  pairBalanceESD: BigNumber
};

function UniswapBuySell({
  userBalanceESD, pairBalanceESD
}: UniswapBuySellProps) {
  const [buyAmount, setBuyAmount] = useState(new BigNumber(0));
  const [sellAmount, setSellAmount] = useState(new BigNumber(0));
  const [cost, setCost] = useState(new BigNumber(0));
  const [proceeds, setProceeds] = useState(new BigNumber(0));

  const updateCost = async (buyAmount) => {
    const buyAmountBN = new BigNumber(buyAmount);
    if (buyAmountBN.lte(new BigNumber(0))) {
      setCost(new BigNumber(0));
      return;
    }
    if (buyAmountBN.gte(pairBalanceESD)) {
      setCost(new BigNumber(0));
      return;
    }
    const cost = await getCost(toBaseUnitBN(buyAmountBN, ESD.decimals));
    setCost(toTokenUnitsBN(new BigNumber(cost), USDC.decimals));
  };

  const updateProceeds = async (sellAmount) => {
    const sellAmountBN = new BigNumber(sellAmount);
    if (sellAmountBN.lte(new BigNumber(0))) {
      setProceeds(new BigNumber(0));
      return;
    }
    const proceeds = await getProceeds(toBaseUnitBN(sellAmountBN, ESD.decimals));
    setProceeds(toTokenUnitsBN(new BigNumber(proceeds), USDC.decimals));
  };

  return (
    <Box heading="Exchange">
      <div style={{ display: 'flex' }}>
        {/* total Issued */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="Døllar Balance" balance={userBalanceESD} suffix={" ESD"}/>
        </div>
        {/* Buy Token from Uniswap */}
        <div style={{ width: '32%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%' }}>
              <>
                <BigNumberInput
                  adornment="ESD"
                  value={buyAmount}
                  setter={(value) => {
                    setBuyAmount(value);
                    isPos(value) ? updateCost(value) : updateCost('0');
                  }}
                />
              </>
            </div>
            <div style={{ width: '40%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Buy"
                onClick={() => {
                  buyESD(
                    toBaseUnitBN(buyAmount, ESD.decimals),
                    increaseWithSlippage(toBaseUnitBN(cost, USDC.decimals)),
                  );
                }}
              />
            </div>
          </div>
          <PriceSection label="Cost: " amt={cost} symbol=" USDC" />
        </div>
        <div style={{ width: '6%' }} />
        {/* Sell Token on Uniswap */}
        <div style={{ width: '32%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '60%' }}>
              <>
                <BigNumberInput
                  adornment="ESD"
                  value={sellAmount}
                  setter={(value) => {
                    setSellAmount(value);
                    isPos(value) ? updateProceeds(value) : updateProceeds('0');
                  }}
                />
                <MaxButton
                  onClick={() => {
                    setSellAmount(userBalanceESD);
                    updateProceeds(userBalanceESD);
                  }}
                />
                <PriceSection label="Proceeds: " amt={proceeds} symbol=" USDC"/>
              </>
            </div>
            <div style={{ width: '40%' }}>
              <Button
                wide
                icon={<IconCircleMinus />}
                label="Sell"
                onClick={() => {
                  sellESD(
                    toBaseUnitBN(sellAmount, ESD.decimals),
                    decreaseWithSlippage(toBaseUnitBN(proceeds, USDC.decimals)),
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

export default UniswapBuySell;