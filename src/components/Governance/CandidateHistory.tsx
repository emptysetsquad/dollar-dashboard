import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Button, IconRight
} from '@aragon/ui';

import { getAllProposals } from '../../utils/web3';
import { ESDS } from "../../constants/tokens";
import BigNumber from "bignumber.js";
import NumberBlock from "../common/NumberBlock";
import {AddressBlock} from "../common";

type CandidateHistoryProps = {
  user: string,
};

type Proposal = {
  candidate: string,
  account: string,
  start: BigNumber,
  period: BigNumber
}

function CandidateHistory({
  user,
}: CandidateHistoryProps) {
  const history = useHistory();
  const [proposals, setProposals] = useState<Proposal[]>([]);

  //Update User balances
  useEffect(() => {
    if (user === '') return;
    let isCancelled = false;

    async function updateUserInfo() {
      const [allProposals] = await Promise.all([
        getAllProposals(ESDS.addr),
      ]);

      if (!isCancelled) {
        setProposals(allProposals);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <Box heading="Candidates">
      {proposals.map((proposal) => {
        return <div style={{display: 'flex'}} key={proposal.candidate}>
          {/* Epoch */}
          <div style={{width: '20%' }}>
            <AddressBlock label="Candidate" address={proposal.candidate} />
          </div>
          <div style={{width: '15%' }}>
            <NumberBlock title="Start" num={proposal.start} />
          </div>
          <div style={{width: '15%' }}>
            <NumberBlock title="Period" num={proposal.period} />
          </div>
          <div style={{width: '20%' }}>
            <AddressBlock label="Proposer" address={proposal.account} />
          </div>
          {/* Go To */}
          <div style={{width: '10%' }} />
          <div style={{ width: '20%', paddingTop: '2%' }}>
            <Button
              wide
              icon={<IconRight />}
              label="Go To"
              onClick={() => {
                history.push(`/governance/candidate/${proposal.candidate}`);
              }}
            />
          </div>
        </div>
      })}
    </Box>
  );
}

export default CandidateHistory;
