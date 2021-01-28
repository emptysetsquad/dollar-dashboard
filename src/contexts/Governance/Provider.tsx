import React, { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import Context from "./Context";
import { Proposal } from "./types";

import {
  getEpoch,
  getImplementation,
  getAllProposals,
  getIsInitialized,
  getApproveFor,
  getRejectFor,
  getTokenTotalSupply,
  getTotalBondedAt,
} from '../../utils/infura';
import { recordVote, commit } from '../../utils/web3';
import { ESDS } from "../../constants/tokens";
import { proposalStatus } from "../../utils/gov";

const Provider: React.FC = ({ children }) => {
  const [implementation, setImplementation] = useState('0x');
  const [proposals, setProposals] = useState<Proposal[]>([]);

  const { account, ethereum }: { account: string | null; ethereum: provider } = useWallet();

  const fetchData = useCallback(
    async (provider: provider) => {
      const data = await getImplementation(ESDS.addr);
      setImplementation(data);
    },
    [setImplementation]
  );

  const fetchProposals = useCallback(
    async (provider: provider) => {
      const [epoch, rawProposals] = await Promise.all([
        getEpoch(ESDS.addr),
        getAllProposals(ESDS.addr),
      ]);

      const formattedProposals = await formatProposals(parseInt(epoch), rawProposals);
      setProposals(formattedProposals);
    },
    [setProposals]
  );

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
    return proposals;
  }

  const handleRecordVote = useCallback(
    async (candidate: string, voteType: number) => {
      recordVote(ESDS.addr, candidate, voteType);
    }, []
  );

  const handleCommit = useCallback(
    async (candidate: string) => {
      commit(ESDS.addr, candidate);
    }, []
  );

  useEffect(() => {
    if (account && ethereum) {
      fetchData(ethereum);
      let refreshInterval = setInterval(() => fetchData(ethereum), 60000);
      return () => clearInterval(refreshInterval);
    }
  }, [account, ethereum, fetchData]);

  useEffect(() => {
    if (account && ethereum) {
      fetchProposals(ethereum);
    }
  }, [account, ethereum, fetchProposals]);

  return (
    <Context.Provider
      value={{
        implementation,
        proposals,

        onRecordVote: handleRecordVote,
        onCommit: handleCommit,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
