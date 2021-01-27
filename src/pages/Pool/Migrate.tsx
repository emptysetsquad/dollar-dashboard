import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box, Button, IconArrowDown, IconCircleMinus,
} from '@aragon/ui';

import usePool from "../../hooks/usePool";
import { isPos } from '../../utils/number';

import { BalanceBlock } from '../../components/common';

function Migrate() {
  const [unbonded, setUnbonded] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [claimed, setClaimed] = useState(false);

  const {
    legacyAddress,
    legacyLPStagedBalance,
    legacyLPBondedBalance,
    legacyESDClaimableBalance,
    legacyESDRewardedBalance,
    legacyStatus,

    onUnbond,
    onWithdraw,
    onClaim
  } = usePool();

  const isRewardNegative = legacyESDRewardedBalance.isGreaterThan(new BigNumber("1000000000000000000"));

  return (
    <Box heading="Migrate">
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {/* Unbond UNI-V2 within Pool */}
        <div style={{flexBasis: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset="Bonded" balance={legacyLPBondedBalance} suffix={"UNI-V2"} />
              <Button
                wide
                icon={<IconCircleMinus/>}
                label="Unbond"
                onClick={() => {
                  onUnbond(
                    legacyAddress,
                    legacyLPBondedBalance,
                    (hash) => setUnbonded(hash.length > 0)
                  );
                }}
                disabled={legacyAddress === '' || !isPos(legacyLPBondedBalance) || unbonded || isRewardNegative}
              />
            </div>
          </div>
        </div>
        {/* Withdraw UNI-V2 within Pool */}
        <div style={{flexBasis: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset="Staged" balance={legacyLPStagedBalance} suffix={"UNI-V2"} />
              <Button
                wide
                icon={<IconCircleMinus/>}
                label="Withdraw"
                onClick={() => {
                  onWithdraw(
                    legacyAddress,
                    legacyLPStagedBalance,
                    (hash) => setWithdrawn(hash.length > 0)
                  );
                }}
                disabled={legacyAddress === '' || !isPos(legacyLPStagedBalance) || withdrawn || legacyStatus !== 0}
              />
            </div>
          </div>
        </div>
        {/* Claim ESD within Pool */}
        <div style={{flexBasis: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset="Claimable" balance={legacyESDClaimableBalance} suffix={"ESD"} />
              <Button
                wide
                icon={<IconArrowDown/>}
                label="Claim"
                onClick={() => {
                  onClaim(
                    legacyAddress,
                    legacyESDClaimableBalance,
                    (hash) => setClaimed(hash.length > 0)
                  );
                }}
                disabled={legacyAddress === '' || !isPos(legacyESDClaimableBalance) || claimed || legacyStatus !== 0}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Migrate;
