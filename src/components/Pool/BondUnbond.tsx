import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton,
} from '../common/index';
import {bondPool, unbondPool} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {UNI} from "../../constants/tokens";
import {DollarPool} from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";

type BondUnbondProps = {
  staged: BigNumber,
  bonded: BigNumber,
  isRewardNegative: boolean,
};

function BondUnbond({
  staged, bonded, isRewardNegative
}: BondUnbondProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Bond">
      <div style={{display: 'flex'}}>
        {/* Total bonded */}
        <div style={{width: '30%'}}>
          <BalanceBlock asset="Bonded" balance={bonded} suffix={"UNI-V2"} />
        </div>
        {/* Bond UNI-V2 within Pool */}
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <>
                <BigNumberInput
                  adornment="UNI-V2"
                  value={bondAmount}
                  setter={setBondAmount}
                />
                <MaxButton
                  onClick={() => {
                    setBondAmount(staged);
                  }}
                />
              </>
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconCirclePlus/>}
                label="Bond"
                onClick={() => {
                  bondPool(
                    DollarPool,
                    toBaseUnitBN(bondAmount, UNI.decimals),
                    (hash) => setBondAmount(new BigNumber(0))
                  );
                }}
                disabled={!isPos(bondAmount)}
              />
            </div>
          </div>
        </div>
        <div style={{width: '6%'}}/>
        {/* Unbond UNI-V2 within Pool */}
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <>
                <BigNumberInput
                  adornment="UNI-V2"
                  value={unbondAmount}
                  setter={setUnbondAmount}
                />
                <MaxButton
                  onClick={() => {
                    setUnbondAmount(bonded);
                  }}
                />
              </>
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconCircleMinus/>}
                label="Unbond"
                onClick={() => {
                  unbondPool(
                    DollarPool,
                    toBaseUnitBN(unbondAmount, UNI.decimals),
                    (hash) => setUnbondAmount(new BigNumber(0))
                  );
                }}
                disabled={!isPos(unbondAmount) || isRewardNegative}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default BondUnbond;
