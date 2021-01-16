import React, {useEffect, useState} from 'react';
import { useWallet } from 'use-wallet';
import BigNumber from "bignumber.js";
import { DataView } from '@aragon/ui';

import {getAllRegulations} from '../../utils/infura';
import {ESD, ESDS} from "../../constants/tokens";
import {formatBN, toTokenUnitsBN} from "../../utils/number";

type Regulation = {
  type: string,
  data: RegulationEntry
}

type RegulationEntry = {
  epoch: string;
  price: string;
  deltaRedeemable: string;
  deltaDebt: string;
  deltaBonded: string;
}

function formatPrice(type, data) {
  return type === 'NEUTRAL' ? '1.00' : formatBN(toTokenUnitsBN(new BigNumber(data.price), ESD.decimals), 3);
}

function formatDeltaRedeemable(type, data) {
  return type === 'INCREASE' ?
    '+' + formatBN(toTokenUnitsBN(new BigNumber(data.newRedeemable), ESD.decimals), 2) :
    '+0.00';
}

function formatDeltaDebt(type, data) {
  return type === 'INCREASE' ?
    '-' + formatBN(toTokenUnitsBN(new BigNumber(data.lessDebt), ESD.decimals), 2) :
    type === 'DECREASE' ?
      '+' + formatBN(toTokenUnitsBN(new BigNumber(data.newDebt), ESD.decimals), 2) :
      '+0.00';
}

function formatDeltaBonded(type, data) {
  return type === 'INCREASE' ?
    '+' + formatBN(toTokenUnitsBN(new BigNumber(data.newBonded), ESD.decimals), 2) :
    '+0.00';
}

function renderEntry({ type, data }: Regulation): string[] {
  return [
    data.epoch.toString(),
    formatPrice(type, data),
    formatDeltaRedeemable(type, data),
    formatDeltaDebt(type, data),
    formatDeltaBonded(type, data),
  ]
}

function RegulationHistory() {
  const { account } = useWallet();

  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [page, setPage] = useState(0)
  const [initialized, setInitialized] = useState(false)

  //Update User balances
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [allRegulations] = await Promise.all([
        getAllRegulations(ESDS.addr),
      ]);

      if (!isCancelled) {
        setRegulations(allRegulations);
        setInitialized(true);
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [account]);

  return (
    <DataView
      fields={['Epoch', 'Price', 'Δ Redeemable', 'Δ Debt', 'Δ Bonded']}
      status={ initialized ? 'default' : 'loading' }
      entries={regulations}
      entriesPerPage={10}
      page={page}
      onPageChange={setPage}
      renderEntry={renderEntry}
    />
  );
}

export default RegulationHistory;
