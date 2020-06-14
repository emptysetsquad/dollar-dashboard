import React, { useState, useEffect } from 'react';
import { Header, IdentityBadge } from '@aragon/ui';
import { useParams } from 'react-router-dom';

import {
  getApproveFor, getEpoch, getIsInitialized, getPeriodFor,
  getRecordedVote,
  getRejectFor, getStartFor,
  getTokenBalance,
  getTokenTotalSupply
} from '../../utils/infura';
import {ESDS} from "../../constants/tokens";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import Vote from "./Vote";
import VoteHeader from "./VoteHeader";
import CommitHeader from "./CommitHeader";
import Commit from "./Commit";
import IconHeader from "../common/IconHeader";

function approved(
  epoch: number, start: number, period: number,
  approve: BigNumber, reject: BigNumber, totalStake: BigNumber
): boolean {
  if (epoch < (start + period)) {
    return false; // Not ended
  }
  if (approve.plus(reject).dividedBy(totalStake).comparedTo(new BigNumber("0.60")) < 0) {
    return false; // Didn't meet quorum
  }
  return approve.comparedTo(reject) > 0;
}

function Candidate({ user }: {user: string}) {
  const { candidate } = useParams();

  const [approveFor, setApproveFor] = useState(new BigNumber(0));
  const [rejectFor, setRejectFor] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [vote, setVote] = useState(0);
  const [userStake, setUserStake] = useState(new BigNumber(0));
  const [epoch, setEpoch] = useState(0);
  const [startEpoch, setStartEpoch] = useState(0);
  const [periodEpoch, setPeriodEpoch] = useState(0);
  const [initialized, setInitialized] = useState(false);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setApproveFor(new BigNumber(0));
      setRejectFor(new BigNumber(0));
      setTotalStake(new BigNumber(0));
      setVote(0);
      setUserStake(new BigNumber(0));
      setEpoch(0);
      setStartEpoch(0);
      setPeriodEpoch(0);
      setInitialized(false);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        approveForStr, rejectForStr, totalStakeStr, voteStr, userStakeStr,
        epochStr, startForStr, periodForStr, isInitialized
      ] = await Promise.all([
        getApproveFor(ESDS.addr, candidate),
        getRejectFor(ESDS.addr, candidate),
        getTokenTotalSupply(ESDS.addr),
        getRecordedVote(ESDS.addr, user, candidate),
        getTokenBalance(ESDS.addr, user),
        getEpoch(ESDS.addr),
        getStartFor(ESDS.addr, candidate),
        getPeriodFor(ESDS.addr, candidate),
        getIsInitialized(ESDS.addr, candidate),
      ]);

      if (!isCancelled) {
        setApproveFor(toTokenUnitsBN(approveForStr, ESDS.decimals));
        setRejectFor(toTokenUnitsBN(rejectForStr, ESDS.decimals));
        setTotalStake(toTokenUnitsBN(totalStakeStr, ESDS.decimals));
        setVote(parseInt(voteStr, 10));
        setUserStake(toTokenUnitsBN(userStakeStr, ESDS.decimals));
        setEpoch(parseInt(epochStr, 10));
        setStartEpoch(parseInt(startForStr, 10));
        setPeriodEpoch(parseInt(periodForStr, 10));
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
  }, [user, candidate]);

  return (
    <>
      <IconHeader icon={<i className="fas fa-poll"/>} text="Candidate"/>
      <IdentityBadge entity={candidate} shorten={false} />

      <VoteHeader
        approveFor={approveFor}
        rejectFor={rejectFor}
        totalStake={totalStake}
      />

      <Header primary="Vote" />
      <Vote
        candidate={candidate}
        stake={userStake}
        vote={vote}
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
        approved={approved(epoch, startEpoch, periodEpoch, approveFor, rejectFor, totalStake)}
      />
    </>
  );
}

export default Candidate;
