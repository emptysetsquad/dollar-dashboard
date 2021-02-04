import { createContext } from "react";
import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
  txs: [],

  onAddTx: () => {},
});

export default Context;
