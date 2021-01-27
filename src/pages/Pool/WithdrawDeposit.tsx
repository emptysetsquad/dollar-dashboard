import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import {
  Box, Button, IconCirclePlus, IconCircleMinus, IconLock
} from '@aragon/ui';

import useBalances from "../../hooks/useBalances";
import usePool from "../../hooks/usePool";
import { isPos } from '../../utils/number';
import { ESD } from "../../constants/tokens";
import { MAX_UINT256 } from "../../constants/values";

import {
  BalanceBlock, MaxButton, BigNumberInput
} from '../../components/common';

type WithdrawDepositProps = {
  user: string
};

function WithdrawDeposit({ user }: WithdrawDepositProps) {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  const { userLPFreeBalance } = useBalances();
  const {
    poolAddress,
    userLPAllowance,
    userLPStagedBalance,
    userStatus,

    onApprove,
    onDeposit,
    onWithdraw
  } = usePool();

  return (
    <Box heading="Stage">
      {userLPAllowance.comparedTo(MAX_UINT256) === 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total Issued */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Staged" balance={userLPStagedBalance} suffix={"UNI-V2"}/>
          </div>
          {/* Deposit UNI-V2 into Pool */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="UNI-V2"
                    value={depositAmount}
                    setter={setDepositAmount}
                    disabled={userStatus !== 0}
                  />
                  <MaxButton
                    onClick={() => {
                      setDepositAmount(userLPFreeBalance);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '7em'}}>
                <Button
                  wide
                  icon={userStatus === 0 ? <IconCirclePlus/> : <IconLock/>}
                  label="Deposit"
                  onClick={() => {
                    onDeposit(
                      depositAmount,
                      (hash) => setDepositAmount(new BigNumber(0))
                    );
                  }}
                  disabled={poolAddress === '' || userStatus !== 0 || !isPos(depositAmount)}
                />
              </div>
            </div>
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Withdraw Døllar from DAO */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="UNI-V2"
                    value={withdrawAmount}
                    setter={setWithdrawAmount}
                    disabled={userStatus !== 0}
                  />
                  <MaxButton
                    onClick={() => {
                      setWithdrawAmount(userLPStagedBalance);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '7em'}}>
                <Button
                  wide
                  icon={userStatus === 0 ? <IconCircleMinus/> : <IconLock/>}
                  label="Withdraw"
                  onClick={() => {
                    onWithdraw(
                      poolAddress,
                      withdrawAmount,
                      (hash) => setWithdrawAmount(new BigNumber(0))
                    );
                  }}
                  disabled={poolAddress === '' || userStatus !== 0 || !isPos(withdrawAmount)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total Issued */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Staged" balance={userLPStagedBalance} suffix={"UNI-V2"}/>
          </div>
          <div style={{flexBasis: '35%'}}/>
          {/* Approve Pool to spend UNI-V2 */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus />}
              label="Approve"
              onClick={onApprove(ESD.addr)}
              disabled={poolAddress === '' || user === ''}
            />
          </div>
        </div>
      }
    </Box>
  );
}

export default WithdrawDeposit;
