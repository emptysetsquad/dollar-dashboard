import { createContext } from "react";
import BigNumber from "bignumber.js";
import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
  epoch: 0,
  epochTime: 0,
  totalESDSSupply: new BigNumber(0),

  userESDAllowance: new BigNumber(0),
  userESDStagedBalance: new BigNumber(0),
  userESDBondedBalance: new BigNumber(0),
  userESDSBalance: new BigNumber(0),
  userStatus: 0,
  userLockedUntil: 0,

  onAdvance: () => {},
  onApprove: () => {},
  onDeposit: () => {},
  onWithdraw: () => {},
  onBond: () => {},
  onUnbond: () => {},
});

export default Context;
