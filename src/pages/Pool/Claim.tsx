import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box, Button, IconArrowDown
} from '@aragon/ui';

import usePool from "../../hooks/usePool";
import { isPos } from '../../utils/number';

import {
  BalanceBlock, MaxButton, BigNumberInput,
} from '../../components/common';

function Claim() {
  const [claimAmount, setClaimAmount] = useState(new BigNumber(0));

  const {
    poolAddress,
    userESDClaimableBalance,
    userStatus,
    onClaim,
  } = usePool();

  return (
    <Box heading="Claim">
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {/* total Issued */}
        <div style={{flexBasis: '32%'}}>
          <BalanceBlock asset="Claimable" balance={userESDClaimableBalance} suffix={"ESD"} />
        </div>
        {/* Deposit UNI-V2 into Pool */}
        <div style={{flexBasis: '35%'}}/>
        <div style={{flexBasis: '33%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%', minWidth: '6em'}}>
              <>
                <BigNumberInput
                  adornment="ESD"
                  value={claimAmount}
                  setter={setClaimAmount}
                  disabled={userStatus !== 0}
                />
                <MaxButton
                  onClick={() => {
                    setClaimAmount(userESDClaimableBalance);
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
                  onClaim(
                    poolAddress,
                    claimAmount,
                    (hash) => setClaimAmount(new BigNumber(0))
                  );
                }}
                disabled={poolAddress === '' || userStatus !== 0 || !isPos(claimAmount)}
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}> Unbond to make rewards claimable after your status is Unlocked </span>
      </div>
    </Box>
  );
}

export default Claim;
