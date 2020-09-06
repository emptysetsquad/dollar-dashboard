import React from 'react';

import BigNumber from "bignumber.js";
import {AddressBlock, BalanceBlock} from "../common";
import TextBlock from "../common/TextBlock";
import {ownership} from "../../utils/number";

type GovernanceHeaderProps = {
  stake: BigNumber,
  totalStake: BigNumber,
  accountStatus: number,
  implementation: string
};

const STATUS_MAP = ["Frozen", "Fluid", "Locked"];

const GovernanceHeader = ({
  stake, totalStake, accountStatus, implementation
}: GovernanceHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="DAO Ownership" balance={ownership(stake, totalStake)} suffix="%" />
    </div>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Proposal Threshold" balance={new BigNumber("1.00")} suffix="%" />
    </div>
    <div style={{ width: '25%' }}>
      <TextBlock label="Status" text={STATUS_MAP[accountStatus]}/>
    </div>
    <div style={{ width: '25%' }}>
      <AddressBlock label="Implementation" address={implementation} />
    </div>
  </div>
);


export default GovernanceHeader;
