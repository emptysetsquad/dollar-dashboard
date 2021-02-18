import { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import useDAO from "./useDAO";
import useGovernance from "./useGovernance";
import { Proposal } from "../contexts/Governance/types";
import { ESDS } from "../constants/tokens";
import { toTokenUnitsBN } from "../utils/number";
import {
  getIsInitialized,
  getApproveFor,
  getRejectFor,
  getRecordedVote,
  getTotalBondedAt,
} from '../utils/infura';

const useCandidate = (candidateAddress: string) => {
  const [candidate, setCandidate] = useState<Proposal>();
  const [initialized, setInitialized] = useState(false);
  const [approveFor, setApproveFor] = useState(new BigNumber(0));
  const [rejectFor, setRejectFor] = useState(new BigNumber(0));
  const [totalStake, setTotalStake] = useState(new BigNumber(0));
  const [userVote, setUserVote] = useState(0);

  const { account, ethereum }: { account: string | null; ethereum: provider } = useWallet();
  const { proposals } = useGovernance();
  const { epoch, totalESDSSupply } = useDAO();

  const fetchCandidate = useCallback(
    async (provider: provider) => {
      const proposal = proposals.filter(
        (e) => e.candidate === candidateAddress
      );

      if (!proposal.length) {
        setCandidate(undefined);
        return;
      }
      setCandidate(proposal[0]);

      const data = await Promise.all([
        getIsInitialized(ESDS.addr, candidateAddress),
        getApproveFor(ESDS.addr, candidateAddress),
        getRejectFor(ESDS.addr, candidateAddress),
      ]);

      setInitialized(data[0]);
      setApproveFor(toTokenUnitsBN(data[1], ESDS.decimals));
      setRejectFor(toTokenUnitsBN(data[2], ESDS.decimals));

      const endsAfter = (proposal[0].start + proposal[0].period - 1);
      if (epoch > endsAfter) {
        const supplyThen = await getTotalBondedAt(ESDS.addr, endsAfter);
        setTotalStake(toTokenUnitsBN(supplyThen, ESDS.decimals));
      } else {
        setTotalStake(totalESDSSupply);
      }
    },
    [epoch, totalESDSSupply, candidateAddress, proposals]
  );

  const fetchUserData = useCallback(
    async (provider: provider) => {
      if (!account) return;
      const data = await Promise.all([
        getRecordedVote(ESDS.addr, account, candidateAddress),
      ]);

      setUserVote(parseInt(data[0], 10));
    },
    [account, candidateAddress, setUserVote]
  );

  useEffect(() => {
    if (account && ethereum) {
      fetchCandidate(ethereum);
    }
    let refreshInterval = setInterval(fetchCandidate, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, ethereum, candidateAddress, fetchCandidate]);

  useEffect(() => {
    if (account && ethereum) {
      fetchUserData(ethereum);
    }
    let refreshInterval = setInterval(fetchUserData, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, ethereum, candidateAddress, fetchUserData]);

  return {
    address: candidate ? candidate.candidate : '0x',
    start: candidate ? candidate.start : 0,
    period: candidate ? candidate.period : 0,
    status: candidate ? candidate.status : 'N/A',
    initialized: initialized,
    approveVotes: approveFor,
    rejectVotes: rejectFor,
    totalVotesPossible: totalStake,

    userVote: userVote,
  }
};

export default useCandidate;
