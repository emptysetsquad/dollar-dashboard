import BigNumber from "bignumber.js";

export interface ContextValues {
  epoch: number;
  epochTime: number;
  totalESDSSupply: BigNumber;

  userESDAllowance: BigNumber;
  userESDStagedBalance: BigNumber;
  userESDBondedBalance: BigNumber;
  userESDSBalance: BigNumber;
  userStatus: number;
  userLockedUntil: number;

  onAdvance: () => void;
  onApprove: () => void;
  onDeposit: (amount: BigNumber) => void;
  onWithdraw: (amount: BigNumber) => void;
  onBond: (amount: BigNumber) => void;
  onUnbond: (amount: BigNumber) => void;
}
