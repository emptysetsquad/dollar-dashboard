import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton,
} from '../common/index';
import {approve, depositPool, withdrawPool} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {UNI} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import {DollarPool} from "../../constants/contracts";
import BigNumberInput from "../common/BigNumberInput";

type WithdrawDepositProps = {
  user: string
  balance: BigNumber,
  allowance: BigNumber,
  stagedBalance: BigNumber,
  status: number
};

function WithdrawDeposit({
  user, balance, allowance, stagedBalance, status
}: WithdrawDepositProps) {
  const [depositAmount, setDepositAmount] = useState(new BigNumber(0));
  const [withdrawAmount, setWithdrawAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Stage">
      {allowance.comparedTo(MAX_UINT256) === 0 ?
        <div style={{display: 'flex'}}>
          {/* total Issued */}
          <div style={{width: '30%'}}>
            <BalanceBlock asset="Staged Balance" balance={stagedBalance}/>
          </div>
          {/* Deposit UNI-V2 into Pool */}
          <div style={{width: '32%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%'}}>
                <>
                  <BigNumberInput
                    adornment="UNI-V2"
                    value={depositAmount}
                    setter={setDepositAmount}
                    disabled={status === 1}
                  />
                  <MaxButton
                    onClick={() => {
                      setDepositAmount(balance);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%'}}>
                <Button
                  wide
                  icon={<IconCirclePlus/>}
                  label="Deposit"
                  onClick={() => {
                    depositPool(
                      DollarPool,
                      toBaseUnitBN(depositAmount, UNI.decimals),
                      (hash) => setDepositAmount(new BigNumber(0))
                    );
                  }}
                  disabled={status === 1 || !isPos(depositAmount)}
                />
              </div>
            </div>
          </div>
          <div style={{width: '6%'}}/>
          {/* Withdraw Døllar from DAO */}
          <div style={{width: '32%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%'}}>
                <>
                  <BigNumberInput
                    adornment="UNI-V2"
                    value={withdrawAmount}
                    setter={setWithdrawAmount}
                    disabled={status === 1}
                  />
                  <MaxButton
                    onClick={() => {
                      setWithdrawAmount(stagedBalance);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%'}}>
                <Button
                  wide
                  icon={<IconCircleMinus/>}
                  label="Withdraw"
                  onClick={() => {
                    withdrawPool(
                      DollarPool,
                      toBaseUnitBN(withdrawAmount, UNI.decimals),
                      (hash) => setWithdrawAmount(new BigNumber(0))
                    );
                  }}
                  disabled={status === 1 || !isPos(withdrawAmount)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex'}}>
          {/* total Issued */}
          <div style={{width: '30%'}}>
            <BalanceBlock asset="UNI-V2 Balance" balance={stagedBalance}/>
          </div>
          <div style={{width: '40%'}}/>
          {/* Approve Pool to spend UNI-V2 */}
          <div style={{width: '30%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus />}
              label="Unlock"
              onClick={() => {
                approve(UNI.addr, DollarPool);
              }}
              disabled={user === ''}
            />
          </div>
        </div>
      }
    </Box>
  );
}

export default WithdrawDeposit;
