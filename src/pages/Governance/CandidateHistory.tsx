import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button, IconRight, DataView
} from '@aragon/ui';

import useGovernance from "../../hooks/useGovernance";

import { AddressBlock } from "../../components/common";

type CandidateHistoryProps = {
  user: string;
};

function CandidateHistory({user}: CandidateHistoryProps) {
  const [page, setPage] = useState(0);

  const history = useHistory();
  const { proposals } = useGovernance();
  const initialized = !proposals.length;

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
