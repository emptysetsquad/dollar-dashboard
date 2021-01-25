import React from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { approve } from '../../utils/web3';

import {UNI} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import {UniswapV2Router02} from "../../constants/contracts";

type UniswapApprovePoolTokenProps = {
  user: string,
  userAllowanceUNI: BigNumber
};

function UniswapApprovePoolToken({
  user, userAllowanceUNI
}: UniswapApprovePoolTokenProps) {
  return (
    <Box heading="Remove Liquidity">
      <div style={{display: 'flex'}}>
        <div style={{width: '73%'}} />
        {/* Approve Uniswap Router to spend UNI */}
        <div style={{width: '27%', paddingTop: '2%'}}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label="Unlock UNI-V2"
            onClick={() => {
              approve(UNI.addr, UniswapV2Router02);
            }}
            disabled={user === '' || userAllowanceUNI.comparedTo(MAX_UINT256.dividedBy(2)) > 0}
          />
        </div>
      </div>
    </Box>
  );
}

export default UniswapApprovePoolToken;