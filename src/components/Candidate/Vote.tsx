import React from 'react';
import {
  Box, Button, IconRotateLeft, IconCircleCheck, IconProhibited
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock,
} from '../common/index';
import {recordVote} from '../../utils/web3';

import {ESDS} from "../../constants/tokens";
import TextBlock from "../common/TextBlock";

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
              recordVote(
                ESDS.addr,
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
              recordVote(
                ESDS.addr,
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
                  recordVote(
                    ESDS.addr,
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
