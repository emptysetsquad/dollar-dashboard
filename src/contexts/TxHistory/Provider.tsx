import React, { useCallback, useState, useEffect } from "react";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import Context from "./Context";
import { Transaction } from "./types";

import { getTxDetails } from '../../utils/infura';
import { storePreference, getPreference } from '../../utils/storage';

const Provider: React.FC = ({ children }) => {
  const [txList, setTxList] = useState<Transaction[]>(JSON.parse(getPreference('txList', '[]')));

  const { ethereum }: { ethereum: provider } = useWallet();

  const fetchTxStatus = useCallback(
    async (provider: provider) => {
      const data = await Promise.all(
        txList.map((tx) => getTxDetails(tx.hash))
      );

      const newList = txList.map((tx, i) => {
        tx.status = data[i].blockNumber !== null ? 'Confirmed' : 'Pending';
        return tx;
      });
      setTxList(newList);
      storePreference('txList', JSON.stringify(newList));
    },
    [txList, setTxList]
  );

  const handleClear = useCallback(
    async () => {
      setTxList([]);
    }, [setTxList]
  );

  const handleAddTx = useCallback(
    async (tx: Transaction) => {
      const newList = [ ...txList, tx];
      setTxList(newList);
      storePreference('txList', JSON.stringify(newList));
    }, [txList, setTxList]
  );

  const handleRemoveTx = useCallback(
    async (tx: Transaction) => {
      const newList = txList.filter((t) => t.hash !== tx.hash);
      setTxList(newList);
      storePreference('txList', JSON.stringify(newList));
    }, [txList, setTxList]
  );

  useEffect(() => {
    if (ethereum) {
      fetchTxStatus(ethereum);
      let refreshInterval = setInterval(() => fetchTxStatus(ethereum), 30000);
      return () => clearInterval(refreshInterval);
    }
  }, [ethereum, fetchTxStatus]);

  return (
    <Context.Provider
      value={{
        txs: txList,

        onClear: handleClear,
        onAddTx: handleAddTx,
        onRemoveTx: handleRemoveTx,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
