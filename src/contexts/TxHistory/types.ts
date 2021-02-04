import BigNumber from "bignumber.js";

export interface ContextValues {
  txs: Transaction[];

  onAddTx: (tx: Transaction) => void;
}

export type Transaction = {
  hash: string,
  description: string | null,
  status: string | null,
}
