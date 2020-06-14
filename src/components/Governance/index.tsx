import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {
  getImplementation,
  getStatusOf,
  getTokenBalance,
  getTokenTotalSupply,
} from '../../utils/infura';
import {ESDS} from "../../constants/tokens";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import GovernanceHeader from "./Header";
import ProposeCandidate from "./ProposeCandidate";
import CandidateHistory from "./CandidateHistory";
import IconHeader from "../common/IconHeader";

function Governance({ user }: {user: string}) {

  const [stake, setStake] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [implementation, setImplementation] = useState("0x");

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setStake(new BigNumber(0));
      setTotalStake(new BigNumber(0));
      setUserStatus(0);
      setImplementation("0x")
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [statusStr, stakeStr, totalStakeStr, implementationStr] = await Promise.all([
        getStatusOf(ESDS.addr, user),
        getTokenBalance(ESDS.addr, user),
        getTokenTotalSupply(ESDS.addr),
        getImplementation(ESDS.addr),
      ]);

      if (!isCancelled) {
        setStake(toTokenUnitsBN(stakeStr, ESDS.decimals));
        setTotalStake(toTokenUnitsBN(totalStakeStr, ESDS.decimals));
        setUserStatus(parseInt(statusStr, 10));
        setImplementation(implementationStr)
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
    <>
      <IconHeader icon={<i className="fas fa-poll"/>} text="Governance"/>

      <GovernanceHeader
        stake={stake}
        totalStake={totalStake}
        accountStatus={userStatus}
        implementation={implementation}
      />

      <Header primary="Propose Candidate" />

      <ProposeCandidate
        user={user}
        stake={stake}
        totalStake={totalStake}
        accountStatus={userStatus}
      />

      <Header primary="Candidate History" />

      <CandidateHistory
        user={user}
      />
    </>
  );
}

export default Governance;
