import React, { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import Context from "./Context";

import { getTokenBalance } from '../../utils/infura';
import { ESD, USDC, UNI } from "../../constants/tokens";
import { toTokenUnitsBN } from '../../utils/number';

const Provider: React.FC = ({ children }) => {
  const [userESDFreeBalance, setUserESDFreeBalance] = useState(new BigNumber(0));
  const [userUSDCFreeBalance, setUserUSDCFreeBalance] = useState(new BigNumber(0));
  const [userLPFreeBalance, setUserLPFreeBalance] = useState(new BigNumber(0));

  const { account, ethereum }: { account: string | null; ethereum: provider } = useWallet();

  const fetchData = useCallback(
    async (userAddress: string, provider: provider) => {
      const data = await Promise.all([
        getTokenBalance(ESD.addr, userAddress),
        getTokenBalance(USDC.addr, userAddress),
        getTokenBalance(UNI.addr, userAddress),
      ]);

      setUserESDFreeBalance(toTokenUnitsBN(data[0], ESD.decimals));
      setUserUSDCFreeBalance(toTokenUnitsBN(data[1], USDC.decimals));
      setUserLPFreeBalance(toTokenUnitsBN(data[2], UNI.decimals));
    },
    [setUserESDFreeBalance, setUserUSDCFreeBalance, setUserLPFreeBalance]
  );

  useEffect(() => {
    if (account && ethereum) {
      fetchData(account, ethereum);
      let refreshInterval = setInterval(() => fetchData(account, ethereum), 10000);
      return () => clearInterval(refreshInterval);
    }
  }, [account, ethereum, fetchData]);

  return (
    <Context.Provider
      value={{
        userESDFreeBalance,
        userUSDCFreeBalance,
        userLPFreeBalance,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
