import React, { useState } from 'react';
import {
  Box, Button, IconArrowDown,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton,
} from '../common/index';
import {claimPool} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {ESD} from "../../constants/tokens";
import {DollarPool} from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";

type ClaimProps = {
  claimable: BigNumber,
  status: number
};

function Claim({
  claimable, status
}: ClaimProps) {
  const [claimableAmount, setClaimableAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Claim">
      <div style={{display: 'flex'}}>
        {/* total Issued */}
        <div style={{width: '30%'}}>
          <BalanceBlock asset="Claimable Balance" balance={claimable}/>
        </div>
        {/* Deposit UNI-V2 into Pool */}
        <div style={{width: '38%'}}/>
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <>
                <BigNumberInput
                  adornment="ESD"
                  value={claimableAmount}
                  setter={setClaimableAmount}
                  disabled={status === 1}
                />
                <MaxButton
                  onClick={() => {
                    setClaimableAmount(claimable);
                  }}
                />
              </>
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconArrowDown/>}
                label="Claim"
                onClick={() => {
                  claimPool(
                    DollarPool,
                    toBaseUnitBN(claimableAmount, ESD.decimals),
                  );
                }}
                disabled={status === 1 || !isPos(claimableAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Claim;
