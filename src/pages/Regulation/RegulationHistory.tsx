import React, { useState } from 'react';
import BigNumber from "bignumber.js";
import { DataView } from '@aragon/ui';

import useRegulation, { Regulation } from "../../hooks/useRegulation";

import { ESD } from "../../constants/tokens";
import { formatBN, toTokenUnitsBN } from "../../utils/number";

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
  const [page, setPage] = useState(0)

  const { history } = useRegulation();
  const initialized = history.length > 0;

  return (
    <DataView
      fields={['Epoch', 'Price', 'Δ Redeemable', 'Δ Debt', 'Δ Bonded']}
      status={ initialized ? 'default' : 'loading' }
      entries={history}
      entriesPerPage={10}
      page={page}
      onPageChange={setPage}
      renderEntry={renderEntry}
    />
  );
}

export default RegulationHistory;
