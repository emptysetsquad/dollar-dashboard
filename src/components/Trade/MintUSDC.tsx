import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {mintTestnetUSDC} from '../../utils/web3';

import { BalanceBlock } from '../common/index';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {USDC} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type MintUSDCProps = {
  user: string,
  userBalanceUSDC: BigNumber,
}


function MintUSDC({
  user, userBalanceUSDC
}: MintUSDCProps) {
  const [mintAmount, setMintAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Mint">
      <div style={{ display: 'flex' }}>
        {/* USDC balance */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="USDC Balance" balance={userBalanceUSDC} />
        </div>
        {/* Mint */}
        <div style={{ width: '38%'}} />
        <div style={{ width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BigNumberInput
                adornment="USDC"
                value={mintAmount}
                setter={setMintAmount}
              />
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Mint"
                onClick={() => {
                  mintTestnetUSDC(toBaseUnitBN(mintAmount, USDC.decimals));
                }}
                disabled={user === '' || !isPos(mintAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default MintUSDC;
