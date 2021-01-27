import React from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';

import useDAO from "../../hooks/useDAO";

import { NumberBlock } from "../../components/common";

type AdvanceEpochProps = {
  epoch: number,
  epochTime: number,
}

function AdvanceEpoch({
  epoch,
  epochTime,
}: AdvanceEpochProps) {
  const { onAdvance } = useDAO();

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
            onClick={onAdvance}
            disabled={epoch >= epochTime}
          />
        </div>
      </div>
    </Box>
  );
}


export default AdvanceEpoch;
