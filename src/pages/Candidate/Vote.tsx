import React from 'react';
import BigNumber from 'bignumber.js';
import {
  Box, Button, IconRotateLeft, IconCircleCheck, IconProhibited
} from '@aragon/ui';

import useGovernance from "../../hooks/useGovernance";

import {
  BalanceBlock, TextBlock,
} from '../../components/common/index';

type VoteProps = {
  candidate: string,
  stake: BigNumber,
  vote: number,
  status: number
};

const VOTE_TYPE_MAP = ["Undecided", "Approve", "Reject"]

function Vote({
  candidate, stake, vote, status
}: VoteProps) {
  const { onRecordVote } = useGovernance();

  return (
    <Box heading="Vote">
      <div style={{display: 'flex'}}>
        {/* User stake */}
        <div style={{width: '20%'}}>
          <BalanceBlock asset="My Stake" balance={stake} suffix={ "ESDS"}/>
        </div>
        <div style={{width: '20%'}}>
          <TextBlock label="My Vote" text={VOTE_TYPE_MAP[vote]}/>
        </div>
        {/* Remove vote for candidate */}
        <div style={{width: '18%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconRotateLeft/>}
            label="Unvote"
            onClick={() => {
              onRecordVote(
                candidate,
                0 // UNDECIDED
              );
            }}
            disabled={status === 1 || vote === 0 || stake.isZero()}
          />
        </div>
        {/* Vote to approve candidate */}
        <div style={{width: '3%'}} />
        <div style={{width: '18%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconCircleCheck/>}
            label="Accept"
            onClick={() => {
              onRecordVote(
                candidate,
                1 // APPROVE
              );
            }}
            disabled={status === 1 || vote === 1 || stake.isZero()}
          />
        </div>
        {/* Vote to reject candidate */}
        <div style={{width: '3%'}} />
        <div style={{width: '18%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
              <Button
                wide
                icon={<IconProhibited/>}
                label="Reject"
                onClick={() => {
                  onRecordVote(
                    candidate,
                    2 // REJECT
                  );
                }}
                disabled={status === 1 || vote === 2 || stake.isZero()}
              />
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Vote;
