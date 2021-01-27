import { createContext } from "react";
import BigNumber from "bignumber.js";
import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
  poolAddress: '',
  totalBonded: new BigNumber(0),
  pairESDBalance: new BigNumber(0),
  pairUSDCBalance: new BigNumber(0),

  userUSDCAllowance: new BigNumber(0),
  userLPAllowance: new BigNumber(0),
  userLPStagedBalance: new BigNumber(0),
  userLPBondedBalance: new BigNumber(0),
  userESDClaimableBalance: new BigNumber(0),
  userESDRewardedBalance: new BigNumber(0),
  userStatus: 0,
  userLockedUntil: 0,

  hasLegacyBalance: false,
  legacyAddress: '',
  legacyLPStagedBalance: new BigNumber(0),
  legacyLPBondedBalance: new BigNumber(0),
  legacyESDClaimableBalance: new BigNumber(0),
  legacyESDRewardedBalance: new BigNumber(0),
  legacyStatus: 0,

  onApprove: () => {},
  onDeposit: () => {},
  onWithdraw: () => {},
  onBond: () => {},
  onUnbond: () => {},
  onClaim: () => {},
  onProvide: () => {},
});

export default Context;
