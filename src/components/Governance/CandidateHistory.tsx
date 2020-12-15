import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button, IconRight, DataView
} from '@aragon/ui';

import {
  getAllProposals,
  getApproveFor,
  getEpoch,
  getIsInitialized,
  getRejectFor,
  getTokenTotalSupply, getTotalBondedAt
} from '../../utils/infura';
import {ESDS} from "../../constants/tokens";
import {AddressBlock} from "../common";
import {proposalStatus} from "../../utils/gov";
import BigNumber from "bignumber.js";

type CandidateHistoryProps = {
  user: string;
};

type Proposal = {
  index: number
  candidate: string,
  account: string,
  start: number,
  period: number,
  status: string
}

async function formatProposals(epoch: number, proposals: any[]): Promise<Proposal[]> {
  const currentTotalStake = await getTokenTotalSupply(ESDS.addr);
  const initializeds = await Promise.all(proposals.map((p) => getIsInitialized(ESDS.addr, p.candidate)));
  const approves = await Promise.all(proposals.map((p) => getApproveFor(ESDS.addr, p.candidate)));
  const rejecteds = await Promise.all(proposals.map((p) => getRejectFor(ESDS.addr, p.candidate)));
  const supplyAts = await Promise.all(proposals.map(async (p) => {
    const at = (p.start + p.period - 1);
    if (epoch > at) {
      return await getTotalBondedAt(ESDS.addr, at);
    }
    return currentTotalStake;
  }));

  for (let i = 0; i < proposals.length; i++) {
    proposals[i].index = (proposals.length - i);
    proposals[i].start = parseInt(proposals[i].start);
    proposals[i].period = parseInt(proposals[i].period);
    proposals[i].status = proposalStatus(
      epoch,
      proposals[i].start,
      proposals[i].period,
      initializeds[i],
      new BigNumber(approves[i]),
      new BigNumber(rejecteds[i]),
      new BigNumber(supplyAts[i])
    );
  }
  return proposals
}

function CandidateHistory({user}: CandidateHistoryProps) {
  const history = useHistory();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [page, setPage] = useState(0)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [epochStr, allProposals] = await Promise.all([
        getEpoch(ESDS.addr),
        getAllProposals(ESDS.addr),
      ]);

      if (!isCancelled) {
        const formattedProposals = await formatProposals(parseInt(epochStr), allProposals);
        setProposals(formattedProposals);
        setInitialized(true);
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
    <DataView
      fields={['Proposal', 'Candidate', 'Proposed', 'Complete', 'Proposer', 'Status', '']}
      status={ initialized ? 'default' : 'loading' }
      // @ts-ignore
      entries={proposals}
      entriesPerPage={10}
      page={page}
      onPageChange={setPage}
      renderEntry={(proposal) => [
        "#" + proposal.index,
        <AddressBlock label="" address={proposal.candidate} />,
        proposal.start.toString(),
        (proposal.start + proposal.period).toString(),
        <AddressBlock label="" address={proposal.account} />,
        proposal.status,
        <Button
          wide
          icon={<IconRight />}
          label="Go To"
          onClick={() => {
            history.push(`/governance/candidate/${proposal.candidate}`);
          }}
        />
      ]}
    />
  );
}

export default CandidateHistory;
