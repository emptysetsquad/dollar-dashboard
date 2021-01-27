import BigNumber from "bignumber.js";

export interface ContextValues {
  poolAddress: string;
  totalBonded: BigNumber;
  pairESDBalance: BigNumber;
  pairUSDCBalance: BigNumber;

  userUSDCAllowance: BigNumber;
  userLPAllowance: BigNumber;
  userLPStagedBalance: BigNumber;
  userLPBondedBalance: BigNumber;
  userESDClaimableBalance: BigNumber;
  userESDRewardedBalance: BigNumber;
  userStatus: number;
  userLockedUntil: number;

  hasLegacyBalance: boolean;
  legacyAddress: string;
  legacyLPStagedBalance: BigNumber;
  legacyLPBondedBalance: BigNumber;
  legacyESDClaimableBalance: BigNumber;
  legacyESDRewardedBalance: BigNumber;
  legacyStatus: number;

  onApprove: (address: string) => void;
  onDeposit: (amount: BigNumber, callback) => void;
  onWithdraw: (pool: string, amount: BigNumber, callback) => void;
  onBond: (amount: BigNumber, callback) => void;
  onUnbond: (pool: string, amount: BigNumber, callback) => void;
  onClaim: (pool: string, amount: BigNumber, callback) => void;
  onProvide: (amount: BigNumber, callback) => void;
}
