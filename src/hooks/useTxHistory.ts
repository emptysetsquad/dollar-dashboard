import { useContext } from "react";

import { TxHistoryContext } from "../contexts/TxHistory";

const useTxHistory = () => {
  return {
    ...useContext(TxHistoryContext),
  };
};

export default useTxHistory;
