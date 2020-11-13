import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton,
} from '../common/index';
import { bond, unbondUnderlying } from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import { ESD, ESDS } from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";
import TextBlock from "../common/TextBlock";

type BondUnbondProps = {
  staged: BigNumber,
  bonded: BigNumber,
  status: number,
  lockup: number,
};

function BondUnbond({
  staged, bonded, status, lockup
}: BondUnbondProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Bond">
      <div style={{display: 'flex'}}>
        {/* Total bonded */}
        <div style={{width: '16%'}}>
          <BalanceBlock asset="Bonded" balance={bonded} suffix={"ESD"}/>
        </div>
        {/* Total bonded */}
        <div style={{width: '16%'}}>
          <TextBlock label="Exit Lockup" text={lockup == 0 ? "" : lockup == 1 ? "1 epoch" : `${lockup} epochs`}/>
        </div>
        {/* Bond Døllar within DAO */}
        <div style={{width: '33%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <>
                <BigNumberInput
                  adornment="ESD"
                  value={bondAmount}
                  setter={setBondAmount}
                  disabled={status === 2}
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
                  bond(
                    ESDS.addr,
                    toBaseUnitBN(bondAmount, ESD.decimals),
                  );
                }}
                disabled={status === 2 || !isPos(bondAmount) || bondAmount.isGreaterThan(staged)}
              />
            </div>
          </div>
        </div>
        <div style={{width: '2%'}}/>
        {/* Unbond Døllar within DAO */}
        <div style={{width: '33%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <>
                <BigNumberInput
                  adornment="ESD"
                  value={unbondAmount}
                  setter={setUnbondAmount}
                  disabled={status === 2}
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
                  unbondUnderlying(
                    ESDS.addr,
                    toBaseUnitBN(unbondAmount, ESD.decimals),
                  );
                }}
                disabled={status === 2 || !isPos(unbondAmount) || unbondAmount.isGreaterThan(bonded)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default BondUnbond;
