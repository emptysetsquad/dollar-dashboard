import { createContext } from "react";
import { ContextValues } from "./types";

const Context = createContext<ContextValues>({
  txs: [],

  onClear: () => {},
  onAddTx: () => {},
  onRemoveTx: () => {},
});

export default Context;
