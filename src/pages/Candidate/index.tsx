import React from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { Header, IdentityBadge } from '@aragon/ui';

import useDAO from "../../hooks/useDAO";
import useCandidate from "../../hooks/useCandidate";
import { proposalStatus } from "../../utils/gov";

import { IconHeader } from "../../components/common";
import Vote from "./Vote";
import VoteHeader from "./VoteHeader";
import CommitHeader from "./CommitHeader";
import Commit from "./Commit";

function Candidate() {
  const { candidate } = useParams();
  const { account } = useWallet();
  const { epoch, userESDSBalance, userStatus } = useDAO();
  const proposal = useCandidate(candidate);

  return (
    <>
      <IconHeader icon={<i className="fas fa-poll"/>} text="Candidate"/>
      <IdentityBadge entity={candidate} shorten={false} />

      <VoteHeader
        approveFor={proposal.approveVotes}
        rejectFor={proposal.rejectVotes}
        totalStake={proposal.totalVotesPossible}
        showParticipation={proposal.start > 106}
      />

      <Header primary="Vote" />
      <Vote
        candidate={proposal.address}
        stake={userESDSBalance}
        vote={proposal.userVote}
        status={userStatus}
      />

      <Header primary="Commit" />
      <CommitHeader
        epoch={epoch}
        startEpoch={proposal.start}
        periodEpoch={proposal.period}
      />

      <Commit
        user={account || ''}
        candidate={proposal.address}
        epoch={epoch}
        startEpoch={proposal.start}
        periodEpoch={proposal.period}
        initialized={proposal.initialized}
        approved={
          proposalStatus(epoch, proposal.start, proposal.period, false, proposal.approveVotes,
            proposal.rejectVotes, proposal.totalVotesPossible) === "Approved"
        }
      />
    </>
  );
}

export default Candidate;
