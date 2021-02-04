import BigNumber from "bignumber.js";

export interface ContextValues {
  txs: Transaction[];

  onClear: () => void;
  onAddTx: (tx: Transaction) => void;
  onRemoveTx: (tx: Transaction) => void;
}

export type Transaction = {
  hash: string,
  description: string | null,
  status: string | null,
}
