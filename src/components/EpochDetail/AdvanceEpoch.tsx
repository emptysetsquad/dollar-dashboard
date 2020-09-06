import React from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import {advance} from '../../utils/web3';
import NumberBlock from "../common/NumberBlock";
import {ESDS} from "../../constants/tokens";

type AdvanceEpochProps = {
  user: string,
  epoch: number,
  epochTime: number,
}

function AdvanceEpoch({
  user,
  epoch,
  epochTime,
}: AdvanceEpochProps) {
  return (
    <Box heading="Advance Epoch">
      <div style={{ display: 'flex' }}>
        {/* Epoch Time */}
        <div style={{ width: '30%' }}>
          <NumberBlock title="Epoch (from current time)" num={epochTime} />
        </div>
        {/* Advance Epoch */}
        <div style={{ width: '40%' }}/>
        <div style={{ width: '30%', paddingTop: '2%' }}>
          <Button
            wide
            icon={<IconCirclePlus />}
            label="Advance"
            onClick={() => {
              advance(ESDS.addr);
            }}
            disabled={user === '' || epoch >= epochTime}
          />
        </div>
      </div>
    </Box>
  );
}


export default AdvanceEpoch;
