import React from 'react';
import { useWallet } from 'use-wallet';
import { Header } from '@aragon/ui';

import useDAO from "../../hooks/useDAO";
import useGovernance from "../../hooks/useGovernance";
import { canPropose } from "../../utils/gov";

import GovernanceHeader from "./Header";
import ProposeCandidate from "./ProposeCandidate";
import CandidateHistory from "./CandidateHistory";
import { IconHeader } from "../../components/common";

function Governance() {
  const { account } = useWallet();
  const {
    totalESDSSupply,
    userESDSBalance,
    userStatus,
  } = useDAO();
  const { implementation } = useGovernance();

  return (
    <>
      <IconHeader icon={<i className="fas fa-poll"/>} text="Governance"/>

      <GovernanceHeader
        stake={userESDSBalance}
        totalStake={totalESDSSupply}
        accountStatus={userStatus}
        implementation={implementation}
      />

      {
        canPropose(userESDSBalance, totalESDSSupply) ?
          <>
            <Header primary="Propose Candidate"/>
            <ProposeCandidate
              user={account || ''}
              stake={userESDSBalance}
              totalStake={totalESDSSupply}
              accountStatus={userStatus}
            />
          </>
          :
          ''
      }

      <Header primary="Candidate History" />

      <CandidateHistory user={account || ''} />
    </>
  );
}

export default Governance;
