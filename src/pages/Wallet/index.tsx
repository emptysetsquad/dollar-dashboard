import React from 'react';
import { useWallet } from 'use-wallet';

import useBalances from "../../hooks/useBalances";
import useDAO from "../../hooks/useDAO";
import { DAO_EXIT_LOCKUP_EPOCHS } from "../../constants/values";

import { IconHeader } from "../../components/common";
import AccountPageHeader from "./Header";
import WithdrawDeposit from "./WithdrawDeposit";
import BondUnbond from "./BondUnbond";

function Wallet() {
  const { account } = useWallet();
  const { userESDFreeBalance } = useBalances();
  const {
    totalESDSSupply,
    userESDAllowance,
    userESDStagedBalance,
    userESDBondedBalance,
    userESDSBalance,
    userStatus,
    userLockedUntil,
  } = useDAO();

  return (
    <>
      <IconHeader icon={<i className="fas fa-dot-circle"/>} text="DAO"/>

      <AccountPageHeader
        accountESDBalance={userESDFreeBalance}
        accountESDSBalance={userESDSBalance}
        totalESDSSupply={totalESDSSupply}
        accountStagedBalance={userESDStagedBalance}
        accountBondedBalance={userESDBondedBalance}
        accountStatus={userStatus}
        unlocked={userLockedUntil}
      />

      <WithdrawDeposit
        user={account || ''}
        balance={userESDFreeBalance}
        allowance={userESDAllowance}
        stagedBalance={userESDStagedBalance}
        status={userStatus}
      />

      <BondUnbond
        staged={userESDStagedBalance}
        bonded={userESDBondedBalance}
        status={userStatus}
        lockup={DAO_EXIT_LOCKUP_EPOCHS}
      />
    </>
  );
}

export default Wallet;
