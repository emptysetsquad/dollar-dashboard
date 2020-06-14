import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock } from '../common/index';
import TextBlock from "../common/TextBlock";

type PoolPageHeaderProps = {
  accountUNIBalance: BigNumber,
  accountRewardedESDBalance: BigNumber,
  accountClaimableESDBalance: BigNumber,
  accountPoolStatus: number,
};

const STATUS_MAP = ["Frozen", "Fluid"];

const PoolPageHeader = ({
  accountUNIBalance, accountRewardedESDBalance, accountClaimableESDBalance, accountPoolStatus
}: PoolPageHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Balance" balance={accountUNIBalance}  suffix={" UNI-V2"}/>
    </div>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Rewarded" balance={accountRewardedESDBalance} suffix={" ESD"} />
    </div>
    <div style={{ width: '25%' }}>
      <BalanceBlock asset="Claimable" balance={accountClaimableESDBalance} suffix={" ESD"} />
    </div>
    <div style={{ width: '25%' }}>
      <TextBlock label="Pool Status" text={STATUS_MAP[accountPoolStatus]}/>
    </div>
  </div>
);


export default PoolPageHeader;
