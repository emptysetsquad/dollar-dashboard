import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock } from '../common/index';
import TextBlock from "../common/TextBlock";
import {ownership} from "../../utils/number";

type AccountPageHeaderProps = {
  accountESDBalance: BigNumber,
  accountESDSBalance: BigNumber,
  totalESDSSupply: BigNumber,
  accountStagedBalance: BigNumber,
  accountBondedBalance: BigNumber,
  accountStatus: number,
};

const STATUS_MAP = ["Frozen", "Fluid", "Locked"];

const AccountPageHeader = ({
  accountESDBalance, accountESDSBalance, totalESDSSupply, accountStagedBalance, accountBondedBalance, accountStatus,
}: AccountPageHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="Balance" balance={accountESDBalance} suffix={" ESD"}/>
    </div>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="Staged" balance={accountStagedBalance}  suffix={" ESD"}/>
    </div>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="Bonded" balance={accountBondedBalance} suffix={" ESD"} />
    </div>
    <div style={{ width: '20%' }}>
      <BalanceBlock asset="DAO Ownership" balance={ownership(accountESDSBalance, totalESDSSupply)}  suffix={"%"}/>
    </div>
    <div style={{ width: '20%' }}>
      <TextBlock label="Status" text={STATUS_MAP[accountStatus]}/>
    </div>
  </div>
);


export default AccountPageHeader;
