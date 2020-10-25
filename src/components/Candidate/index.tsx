import React, { useState, useEffect } from 'react';
import { Header, IdentityBadge } from '@aragon/ui';
import { useParams } from 'react-router-dom';

import {
  getApproveFor, getEpoch, getIsInitialized, getPeriodFor,
  getRecordedVote,
  getRejectFor, getStartFor, getStatusOf,
  getTokenBalance,
  getTokenTotalSupply, getTotalBondedAt
} from '../../utils/infura';
import {ESDS} from "../../constants/tokens";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import Vote from "./Vote";
import VoteHeader from "./VoteHeader";
import CommitHeader from "./CommitHeader";
import Commit from "./Commit";
import IconHeader from "../common/IconHeader";
import {proposalStatus} from "../../utils/gov";

function Candidate({ user }: {user: string}) {
  const { candidate } = useParams();

  const [approveFor, setApproveFor] = useState(new BigNumber(0));
  const [rejectFor, setRejectFor] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [vote, setVote] = useState(0);
  const [status, setStatus] = useState(0);
  const [userStake, setUserStake] = useState(new BigNumber(0));
  const [epoch, setEpoch] = useState(0);
  const [startEpoch, setStartEpoch] = useState(0);
  const [periodEpoch, setPeriodEpoch] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user === '') {
      setVote(0);
      setStatus(0);
      setUserStake(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        voteStr, statusStr, userStakeStr,
      ] = await Promise.all([
        getRecordedVote(ESDS.addr, user, candidate),
        getStatusOf(ESDS.addr, user),
        getTokenBalance(ESDS.addr, user),
      ]);

      if (!isCancelled) {
        setVote(parseInt(voteStr, 10));
        setStatus(parseInt(statusStr, 10));
        setUserStake(toTokenUnitsBN(userStakeStr, ESDS.decimals));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, candidate]);

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      let [
        approveForStr, rejectForStr, totalStakeStr,
        epochStr, startForStr, periodForStr, isInitialized
      ] = await Promise.all([
        getApproveFor(ESDS.addr, candidate),
        getRejectFor(ESDS.addr, candidate),
        getTokenTotalSupply(ESDS.addr),
        getEpoch(ESDS.addr),
        getStartFor(ESDS.addr, candidate),
        getPeriodFor(ESDS.addr, candidate),
        getIsInitialized(ESDS.addr, candidate),
      ]);

      const epochN = parseInt(epochStr, 10);
      const startN = parseInt(startForStr, 10);
      const periodN = parseInt(periodForStr, 10);

      const endsAfter = (startN + periodN - 1);
      if (epochN > endsAfter) {
        totalStakeStr = await getTotalBondedAt(ESDS.addr, endsAfter);
      }

      if (!isCancelled) {
        setApproveFor(toTokenUnitsBN(approveForStr, ESDS.decimals));
        setRejectFor(toTokenUnitsBN(rejectForStr, ESDS.decimals));
        setTotalStake(toTokenUnitsBN(totalStakeStr, ESDS.decimals));
        setEpoch(epochN);
        setStartEpoch(startN);
        setPeriodEpoch(periodN);
        setInitialized(isInitialized);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [candidate]);

  return (
    <>
      <IconHeader icon={<i className="fas fa-poll"/>} text="Candidate"/>
      <IdentityBadge entity={candidate} shorten={false} />

      <VoteHeader
        approveFor={approveFor}
        rejectFor={rejectFor}
        totalStake={totalStake}
        showParticipation={startEpoch > 106}
      />

      <Header primary="Vote" />
      <Vote
        candidate={candidate}
        stake={userStake}
        vote={vote}
        status={status}
      />

      <Header primary="Commit" />
      <CommitHeader
        epoch={epoch}
        startEpoch={startEpoch}
        periodEpoch={periodEpoch}
      />

      <Commit
        user={user}
        candidate={candidate}
        epoch={epoch}
        startEpoch={startEpoch}
        periodEpoch={periodEpoch}
        initialized={initialized}
        approved={proposalStatus(epoch, startEpoch, periodEpoch, false, approveFor, rejectFor, totalStake) === "Approved"}
      />
    </>
  );
}

export default Candidate;
