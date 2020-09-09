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

type BondUnbondProps = {
  staged: BigNumber,
  bonded: BigNumber,
};

function BondUnbond({
  staged, bonded
}: BondUnbondProps) {
  const [bondAmount, setBondAmount] = useState(new BigNumber(0));
  const [unbondAmount, setUnbondAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Bond">
      <div style={{display: 'flex'}}>
        {/* Total bonded */}
        <div style={{width: '30%'}}>
          <BalanceBlock asset="Bonded" balance={bonded} suffix={"ESD"}/>
        </div>
        {/* Bond Døllar within DAO */}
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <>
                <BigNumberInput
                  adornment="ESD"
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
                  bond(
                    ESDS.addr,
                    toBaseUnitBN(bondAmount, ESD.decimals),
                  );
                }}
                disabled={!isPos(bondAmount) || bondAmount.isGreaterThan(staged)}
              />
            </div>
          </div>
        </div>
        <div style={{width: '6%'}}/>
        {/* Unbond Døllar within DAO */}
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <>
                <BigNumberInput
                  adornment="ESD"
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
                  unbondUnderlying(
                    ESDS.addr,
                    toBaseUnitBN(unbondAmount, ESD.decimals),
                  );
                }}
                disabled={!isPos(unbondAmount) || unbondAmount.isGreaterThan(bonded)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default BondUnbond;
