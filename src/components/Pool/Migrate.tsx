import React, { useState } from 'react';
import {
  Box, Button, IconArrowDown, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock,
} from '../common/index';
import {claimPool, unbondPool, withdrawPool} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {ESD, UNI} from "../../constants/tokens";
import {LegacyDollarPool} from "../../constants/contracts";

type MigrateProps = {
  staged: BigNumber,
  claimable: BigNumber,
  bonded: BigNumber,
  status: number,
  isRewardNegative: boolean,
};

function Migrate({
  staged, claimable, bonded, status, isRewardNegative
}: MigrateProps) {
  const [unbonded, setUnbonded] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [claimed, setClaimed] = useState(false);

  return (
    <Box heading="Migrate">
      <div style={{display: 'flex'}}>
        {/* Unbond UNI-V2 within Pool */}
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset="Bonded" balance={bonded} suffix={"UNI-V2"} />
              <Button
                wide
                icon={<IconCircleMinus/>}
                label="Unbond"
                onClick={() => {
                  unbondPool(
                    LegacyDollarPool,
                    toBaseUnitBN(bonded, UNI.decimals),
                    (hash) => setUnbonded(hash.length > 0)
                  );
                }}
                disabled={!isPos(bonded) || unbonded || isRewardNegative}
              />
            </div>
          </div>
        </div>
        {/* Withdraw UNI-V2 within Pool */}
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset="Staged" balance={staged} suffix={"UNI-V2"} />
              <Button
                wide
                icon={<IconCircleMinus/>}
                label="Withdraw"
                onClick={() => {
                  withdrawPool(
                    LegacyDollarPool,
                    toBaseUnitBN(staged, UNI.decimals),
                    (hash) => setWithdrawn(hash.length > 0)
                  );
                }}
                disabled={!isPos(staged) || withdrawn || status == 1}
              />
            </div>
          </div>
        </div>
        {/* Claim ESD within Pool */}
        <div style={{width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BalanceBlock asset="Claimable" balance={claimable} suffix={"ESD"} />
              <Button
                wide
                icon={<IconArrowDown/>}
                label="Claim"
                onClick={() => {
                  claimPool(
                    LegacyDollarPool,
                    toBaseUnitBN(claimable, ESD.decimals),
                    (hash) => setClaimed(hash.length > 0)
                  );
                }}
                disabled={!isPos(claimable) || claimed || status == 1}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Migrate;
