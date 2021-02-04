import React, { useCallback, useState } from "react";

import Context from "./Context";
import { Transaction } from "./types";

import { storePreference, getPreference } from '../../utils/storage';

const Provider: React.FC = ({ children }) => {
  const [txList, setTxList] = useState<Transaction[]>(JSON.parse(getPreference('txList', '[]')));

  const handleAddTx = useCallback(
    async (tx: Transaction) => {
      const newList = txList.concat(tx);
      setTxList(newList);
      storePreference('txList', JSON.stringify(newList));
    }, [txList, setTxList]
  );

  return (
    <Context.Provider
      value={{
        txs: txList,

        onAddTx: handleAddTx,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
