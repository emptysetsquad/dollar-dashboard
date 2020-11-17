import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton,
} from '../common/index';
import {approve, deposit, withdraw} from '../../utils/web3';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {ESD, ESDS} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
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
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total Issued */}
          <div style={{flexBasis: '30%'}}>
            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={"ESD"}/>
          </div>
          {/* Deposit Døllar into DAO */}
          <div style={{flexBasis: '32%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="ESD"
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
              <div style={{width: '40%', minWidth: '6em'}}>
                <Button
                  wide
                  icon={<IconCirclePlus/>}
                  label="Deposit"
                  onClick={() => {
                    deposit(
                      ESDS.addr,
                      toBaseUnitBN(depositAmount, ESD.decimals),
                    );
                  }}
                  disabled={status === 1 || !isPos(depositAmount) || depositAmount.isGreaterThan(balance)}
                />
              </div>
            </div>
          </div>
          <div style={{flexBasis: '6%'}}/>
          {/* Withdraw Døllar from DAO */}
          <div style={{flexBasis: '32%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '7em'}}>
                <>
                  <BigNumberInput
                    adornment="ESD"
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
              <div style={{width: '40%', minWidth: '7em'}}>
                <Button
                  wide
                  icon={<IconCircleMinus/>}
                  label="Withdraw"
                  onClick={() => {
                    withdraw(
                      ESDS.addr,
                      toBaseUnitBN(withdrawAmount, ESD.decimals),
                    );
                  }}
                  disabled={status === 1 || !isPos(withdrawAmount) || withdrawAmount.isGreaterThan(stagedBalance)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total Issued */}
          <div style={{flexBasis: '30%'}}>
            <BalanceBlock asset="Staged" balance={stagedBalance} suffix={"ESD"}/>
          </div>
          <div style={{flexBasis: '40%'}}/>
          {/* Approve DAO to spend Døllar */}
          <div style={{flexBasis: '30%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus />}
              label="Unlock"
              onClick={() => {
                approve(ESD.addr, ESDS.addr);
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
