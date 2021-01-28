import { useCallback, useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import { useWallet } from "use-wallet";
import { provider } from "web3-core";

import {
  getPoolTotalClaimable,
  getPoolTotalRewarded,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBonded,
  getTotalStaged,
  getAllRegulations,
} from '../utils/infura';
import { ESD, ESDS, UNI } from "../constants/tokens";
import { toTokenUnitsBN } from "../utils/number";
import { getPoolAddress, getLegacyPoolAddress } from "../utils/pool";

export type Regulation = {
  type: string,
  data: RegulationEntry
}

export type RegulationEntry = {
  epoch: string;
  price: string;
  deltaRedeemable: string;
  deltaDebt: string;
  deltaBonded: string;
}

const useRegulation = () => {
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [totalStaged, setTotalStaged] = useState(new BigNumber(0));
  const [poolLiquidity, setPoolLiquidity] = useState(new BigNumber(0));
  const [poolTotalRewarded, setPoolTotalRewarded] = useState(new BigNumber(0));
  const [poolTotalClaimable, setPoolTotalClaimable] = useState(new BigNumber(0));
  const [legacyPoolTotalRewarded, setLegacyPoolTotalRewarded] = useState(new BigNumber(0));
  const [legacyPoolTotalClaimable, setLegacyPoolTotalClaimable] = useState(new BigNumber(0));
  const [history, setHistory] = useState<Regulation[]>([]);

  const { ethereum }: { ethereum: provider } = useWallet();

  const fetchData = useCallback(
    async (provider: provider) => {
      const poolAddress = await getPoolAddress();
      const legacyPoolAddress = getLegacyPoolAddress(poolAddress);

      const [
        totalSupplyStr, totalBondedStr, totalStagedStr,
        poolLiquidityStr, poolTotalRewardedStr, poolTotalClaimableStr,
        legacyPoolTotalRewardedStr, legacyPoolTotalClaimableStr,
        allRegulations
      ] = await Promise.all([
        getTokenTotalSupply(ESD.addr),
        getTotalBonded(ESDS.addr),
        getTotalStaged(ESDS.addr),

        getTokenBalance(ESD.addr, UNI.addr),
        getPoolTotalRewarded(poolAddress),
        getPoolTotalClaimable(poolAddress),
        getPoolTotalRewarded(legacyPoolAddress),
        getPoolTotalClaimable(legacyPoolAddress),

        getAllRegulations(ESDS.addr),
      ]);

      setTotalSupply(toTokenUnitsBN(totalSupplyStr, ESD.decimals));
      setTotalBonded(toTokenUnitsBN(totalBondedStr, ESD.decimals));
      setTotalStaged(toTokenUnitsBN(totalStagedStr, ESD.decimals));

      setPoolLiquidity(toTokenUnitsBN(poolLiquidityStr, ESD.decimals));
      setPoolTotalRewarded(toTokenUnitsBN(poolTotalRewardedStr, ESD.decimals));
      setPoolTotalClaimable(toTokenUnitsBN(poolTotalClaimableStr, ESD.decimals));
      setLegacyPoolTotalRewarded(toTokenUnitsBN(legacyPoolTotalRewardedStr, ESD.decimals));
      setLegacyPoolTotalClaimable(toTokenUnitsBN(legacyPoolTotalClaimableStr, ESD.decimals));

      setHistory(allRegulations);
    },
    []
  );

  useEffect(() => {
    if (ethereum) {
      fetchData(ethereum);
    }
    let refreshInterval = setInterval(fetchData, 60000);
    return () => clearInterval(refreshInterval);
  }, [ethereum, fetchData]);

  return {
    totalSupply: totalSupply,
    totalBonded: totalBonded,
    totalStaged: totalStaged,

    poolLiquidity: poolLiquidity,
    poolTotalRewarded: poolTotalRewarded,
    poolTotalClaimable: poolTotalClaimable,
    legacyPoolTotalRewarded: legacyPoolTotalRewarded,
    legacyPoolTotalClaimable: legacyPoolTotalClaimable,

    history: history,
  }
};

export default useRegulation;
