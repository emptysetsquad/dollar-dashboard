import BigNumber from "bignumber.js";

export interface ContextValues {
  implementation: string;
  proposals: Proposal[];

  onRecordVote: (candidate: string, voteType: number) => void;
  onCommit: (candidate: string) => void;
}

export type Proposal = {
  index: number
  candidate: string,
  account: string,
  start: number,
  period: number,
  status: string
}
