import React, { useState } from 'react';
import {
  Box, TextInput, Button, IconToken,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {recordVote} from '../../utils/web3';

import {ESDS} from "../../constants/tokens";
import {canPropose} from "../../utils/gov";

type ProposeCandidateProps = {
  user: string,
  stake: BigNumber,
  totalStake: BigNumber,
  accountStatus: number
};

function plausibleCandidate(candidate: string): boolean {
  return (/^(0x)[0-9a-fA-F]{40}$/i.test(candidate));
}

function ProposeCandidate({
  user, stake, totalStake, accountStatus,
}: ProposeCandidateProps) {
  const [candidate, setCandidate] = useState("0x");

  return (
    <Box heading="Propose">
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {/* User balance */}
        <div style={{flexBasis: '62%', paddingTop: '2%'}}>
          <>
            <TextInput
              wide
              value={candidate}
              onChange={(event) => {
                if (event.target.value) {
                  setCandidate(event.target.value);
                } else {
                  setCandidate("0x");
                }
              }}
            />
          </>
        </div>
        <div style={{flexBasis: '6%'}}/>
        {/* Purchase coupons */}
        <div style={{flexBasis: '32%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconToken/>}
            label="Propose"
            onClick={() => {
              recordVote(
                ESDS.addr,
                candidate,
                1 // APPROVE
              );
            }}
            disabled={user === '' || !canPropose(stake, totalStake) || !plausibleCandidate(candidate) || accountStatus === 1}
          />
        </div>
      </div>
    </Box>
  );
}

export default ProposeCandidate;
