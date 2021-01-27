import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box, Button, IconCirclePlus, IconCircleMinus, IconCaution
} from '@aragon/ui';

import useDAO from "../../hooks/useDAO";
import { isPos } from '../../utils/number';

import {
  BalanceBlock, MaxButton, BigNumberInput, TextBlock
} from '../../components/common';

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

  const { onBond, onUnbond } = useDAO();

  return (
    <Box heading="Bond">
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {/* Total bonded */}
        <div style={{flexBasis: '16%'}}>
          <BalanceBlock asset="Bonded" balance={bonded} suffix={"ESD"}/>
        </div>
        {/* Total bonded */}
        <div style={{flexBasis: '16%'}}>
          <TextBlock label="Exit Lockup" text={lockup === 0 ? "" : lockup === 1 ? "1 epoch" : `${lockup} epochs`}/>
        </div>
        {/* Bond Døllar within DAO */}
        <div style={{flexBasis: '33%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%', minWidth: '6em'}}>
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
            <div style={{width: '40%', minWidth: '7em'}}>
              <Button
                wide
                icon={status === 0 ? <IconCirclePlus/> : <IconCaution/>}
                label="Bond"
                onClick={() => {onBond(bondAmount);}}
                disabled={status === 2 || !isPos(bondAmount) || bondAmount.isGreaterThan(staged)}
              />
            </div>
          </div>
        </div>
        <div style={{width: '2%'}}/>
        {/* Unbond Døllar within DAO */}
        <div style={{flexBasis: '33%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%', minWidth: '6em'}}>
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
            <div style={{width: '40%', minWidth: '7em'}}>
              <Button
                wide
                icon={status === 0 ? <IconCircleMinus/> : <IconCaution/>}
                label="Unbond"
                onClick={() => {onUnbond(unbondAmount)}}
                disabled={status === 2 || !isPos(unbondAmount) || unbondAmount.isGreaterThan(bonded)}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}> Bonding events will restart the lockup timer </span>
      </div>
    </Box>
  );
}

export default BondUnbond;
