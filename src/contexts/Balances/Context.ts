import { createContext } from "react";
import BigNumber from "bignumber.js";
import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
  userESDFreeBalance: new BigNumber(0),
  userUSDCFreeBalance: new BigNumber(0),
  userLPFreeBalance: new BigNumber(0),
});

export default Context;
