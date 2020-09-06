import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {
  getEpoch,
  getInstantaneousPrice, getToken0,
  getTokenTotalSupply, getTotalBonded, getTotalRedeemable, getTotalStaged,
} from '../../utils/infura';
import {ESD, ESDS, USDC} from "../../constants/tokens";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import RegulationHeader from "./Header";
import RegulationHistory from "./RegulationHistory";
import {BOOTSTRAPPING_EPOCHS, BOOTSTRAPPING_ORACLE_PRICE} from "../../constants/values";
import IconHeader from "../common/IconHeader";

async function approximatePrice(): Promise<BigNumber> {
  const [reserve, token0] = await Promise.all([getInstantaneousPrice(), getToken0()]);
  const token0Balance = new BigNumber(reserve.reserve0);
  const token1Balance = new BigNumber(reserve.reserve1);
  if (token0.toLowerCase() === USDC.addr.toLowerCase()) {
    return token0Balance.multipliedBy(new BigNumber(10).pow(12)).dividedBy(token1Balance);
  }
  return token1Balance.multipliedBy(new BigNumber(10).pow(12)).dividedBy(token0Balance);
}

function Governance({ user }: {user: string}) {

  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [totalStaged, setTotalStaged] = useState(new BigNumber(0));
  const [totalRedeemable, setTotalRedeemable] = useState(new BigNumber(0));
  const [price, setPrice] = useState(new BigNumber(0));
  const [epoch, setEpoch] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [totalSupplyStr, totalBondedStr, totalStagedStr, totalRedeemableStr, priceStr, epochStr] = await Promise.all([
        getTokenTotalSupply(ESD.addr),
        getTotalBonded(ESDS.addr),
        getTotalStaged(ESDS.addr),
        getTotalRedeemable(ESDS.addr),
        approximatePrice(), // Approx price by "buying" 1 ESD
        getEpoch(ESDS.addr)
      ]);

      if (!isCancelled) {
        setTotalSupply(toTokenUnitsBN(totalSupplyStr, ESD.decimals));
        setTotalBonded(toTokenUnitsBN(totalBondedStr, ESD.decimals));
        setTotalStaged(toTokenUnitsBN(totalStagedStr, ESD.decimals));
        setTotalRedeemable(toTokenUnitsBN(totalRedeemableStr, ESD.decimals));
        setPrice(priceStr);
        setEpoch(parseInt(epochStr, 10));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  });

  return (
    <>
      <IconHeader icon={<i className="fas fa-chart-area"/>} text="Protocol Statistics"/>

      <RegulationHeader
        totalSupply={totalSupply}
        totalBonded={totalBonded}
        totalStaged={totalStaged}
        totalRedeemable={totalRedeemable}
        price={epoch <= BOOTSTRAPPING_EPOCHS ? BOOTSTRAPPING_ORACLE_PRICE : price}
      />

      <Header primary="Regulation History" />

      <RegulationHistory
        user={user}
      />
    </>
  );
}

export default Governance;
