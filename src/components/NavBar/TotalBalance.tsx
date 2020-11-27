import React, {useEffect, useState} from 'react';

import {
  Button, IdentityBadge, IconConnect, Box, IconPower, LinkBase,
} from '@aragon/ui';

import { connect } from '../../utils/web3';
import BigNumber from "bignumber.js";
import {getBalanceBonded, getBalanceOfStaged, getTokenBalance} from "../../utils/infura";
import {ESD, ESDS} from "../../constants/tokens";
import {formatBN, toTokenUnitsBN} from "../../utils/number";

type TotalBalanceProps = {
  user: string,
}

function TotalBalance({ user }: TotalBalanceProps) {
  const [totalBalance, setTotalBalance] = useState(new BigNumber(0));

  user = '0x07b991579b4e1Ee01d7a3342AF93E96ecC59E0B3';

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setTotalBalance(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [esdBalance, stagedBalance, bondedBalance] = await Promise.all([
        getTokenBalance(ESD.addr, user),
        getBalanceOfStaged(ESDS.addr, user),
        getBalanceBonded(ESDS.addr, user),
      ]);

      const userBalance = toTokenUnitsBN(esdBalance, ESD.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, ESDS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, ESDS.decimals);

      if (!isCancelled) {
        setTotalBalance(
          new BigNumber(userBalance).plus(
            new BigNumber(userStagedBalance).plus(
              new BigNumber(userBondedBalance)
            )
          )
        );
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <div style={{ fontSize: 14, padding: 3, fontWeight: 400, lineHeight: 1.5, fontFamily: 'aragon-ui-monospace, monospace'}}>
      ∅{formatBN(totalBalance, 2)}
    </div>
  );
}


export default TotalBalance;
