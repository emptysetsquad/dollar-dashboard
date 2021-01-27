import React from 'react';
import { useWallet } from 'use-wallet';
import { Header } from '@aragon/ui';

import useBalances from "../../hooks/useBalances";
import usePool from "../../hooks/usePool";
import { POOL_EXIT_LOCKUP_EPOCHS } from "../../constants/values";

import {IconHeader} from "../../components/common";
import WithdrawDeposit from "./WithdrawDeposit";
import BondUnbond from "./BondUnbond";
import PoolPageHeader from "./Header";
import Claim from "./Claim";
import Provide from "./Provide";
import Migrate from "./Migrate";

function Pool() {
  const { account } = useWallet();
  const {
    userLPFreeBalance,
  } = useBalances();
  const {
    poolAddress,
    totalBonded,

    userLPStagedBalance,
    userLPBondedBalance,
    userESDClaimableBalance,
    userESDRewardedBalance,
    userStatus,
    userLockedUntil,

    hasLegacyBalance,
  } = usePool();

  // Check for error in .call()
  return (
    <>
      <IconHeader icon={<i className="fas fa-parachute-box"/>} text="LP Reward Pool"/>

      {hasLegacyBalance ?
        <>
          <Header primary={"Legacy Pool Migration"}/>
          <Migrate />
        </>
        : ''}

      <PoolPageHeader
        accountUNIBalance={userLPFreeBalance}
        accountBondedBalance={userLPBondedBalance}
        accountRewardedESDBalance={userESDRewardedBalance}
        accountClaimableESDBalance={userESDClaimableBalance}
        poolTotalBonded={totalBonded}
        accountPoolStatus={userStatus}
        unlocked={userLockedUntil}
      />

      <WithdrawDeposit user={account || ''} />

      <BondUnbond
        poolAddress={poolAddress}
        staged={userLPStagedBalance}
        bonded={userLPBondedBalance}
        status={userStatus}
        lockup={POOL_EXIT_LOCKUP_EPOCHS}
      />

      <Claim />

      <Provide user={account || ''} />
    </>
  );
}

export default Pool;
