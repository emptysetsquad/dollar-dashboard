import BigNumber from "bignumber.js";

export interface ContextValues {
  userESDFreeBalance: BigNumber;
  userUSDCFreeBalance: BigNumber;
  userLPFreeBalance: BigNumber;
}
