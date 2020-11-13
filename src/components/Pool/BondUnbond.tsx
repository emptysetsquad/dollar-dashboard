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
import {ESDS, UNI} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import TextBlock from "../common/TextBlock";

type BondUnbondProps = {
  poolAddress: string,
  staged: BigNumber,
  bonded: BigNumber,
  lockup: number,
};

function BondUnbond({
  poolAddress, staged, bonded, lockup
}: BondUnbondProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Bond">
      <div style={{display: 'flex'}}>
        {/* Total bonded */}
        <div style={{width: '16%'}}>
          <BalanceBlock asset="Bonded" balance={bonded} suffix={"UNI-V2"} />
        </div>
        {/* Exit lockup */}
        <div style={{width: '16%'}}>
          <TextBlock label="Exit Lockup" text={lockup == 0 ? "" : lockup == 1 ? "1 epoch" : `${lockup} epochs`}/>
        </div>
        {/* Bond UNI-V2 within Pool */}
        <div style={{width: '33%', paddingTop: '2%'}}>
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
                    poolAddress,
                    toBaseUnitBN(bondAmount, UNI.decimals),
                    (hash) => setBondAmount(new BigNumber(0))
                  );
                }}
                disabled={poolAddress === '' || !isPos(bondAmount)}
              />
            </div>
          </div>
        </div>
        <div style={{width: '2%'}}/>
        {/* Unbond UNI-V2 within Pool */}
        <div style={{width: '33%', paddingTop: '2%'}}>
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
                    poolAddress,
                    toBaseUnitBN(unbondAmount, UNI.decimals),
                    (hash) => setUnbondAmount(new BigNumber(0))
                  );
                }}
                disabled={poolAddress === '' || !isPos(unbondAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default BondUnbond;
