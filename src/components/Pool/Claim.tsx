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
import BigNumberInput from "../common/BigNumberInput";

type ClaimProps = {
  poolAddress: string
  claimable: BigNumber,
  status: number
};

function Claim({
  poolAddress, claimable, status
}: ClaimProps) {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Claim">
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {/* total Issued */}
        <div style={{flexBasis: '30%'}}>
          <BalanceBlock asset="Claimable" balance={claimable} suffix={"ESD"} />
        </div>
        {/* Deposit UNI-V2 into Pool */}
        <div style={{width: '38%'}}/>
        <div style={{flexBasis: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%', minWidth: '6em'}}>
              <>
                <BigNumberInput
                  adornment="ESD"
                  value={claimAmount}
                  setter={setClaimAmount}
                  disabled={status === 1}
                />
                <MaxButton
                  onClick={() => {
                    setClaimAmount(claimable);
                  }}
                />
              </>
            </div>
            <div style={{width: '40%', minWidth: '6em'}}>
              <Button
                wide
                icon={<IconArrowDown/>}
                label="Claim"
                onClick={() => {
                  claimPool(
                    poolAddress,
                    toBaseUnitBN(claimAmount, ESD.decimals),
                    (hash) => setClaimAmount(new BigNumber(0))
                  );
                }}
                disabled={poolAddress === '' || status === 1 || !isPos(claimAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Claim;
