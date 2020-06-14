import React from 'react';
import {
  Box, Button, IconUpload
} from '@aragon/ui';
import TextBlock from "../common/TextBlock";
import {ESDS} from "../../constants/tokens";
import {commit} from "../../utils/web3";

type CommitProps = {
  user: string,
  candidate: string,
  epoch: number
  startEpoch: number,
  periodEpoch: number,
  initialized: boolean,
  approved: boolean
};

function Commit({
  user, candidate, epoch, startEpoch, periodEpoch, initialized, approved,
}: CommitProps) {
  function status(epoch, startEpoch, periodEpoch, initialized, approved): string {
    if (startEpoch === 0) {
      return "N/A";
    }
    if (epoch < startEpoch) {
      return "Unknown";
    }
    if (epoch < (startEpoch + periodEpoch)) {
      return "Voting"
    }
    if (initialized) {
      return "Committed"
    }
    if (approved) {
      return "Approved"
    }
    return "Rejected"
  }
  const s = status(epoch, startEpoch, periodEpoch, initialized, approved);

  return (
    <Box heading="Commit">
      <div style={{display: 'flex'}}>
        {/* Status */}
        <div style={{ width: '30%' }}>
          <TextBlock label="Status" text={s} />
        </div>
        <div style={{width: '40%'}} />
        {/* Commit candidate */}
        <div style={{width: '30%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
              <Button
                wide
                icon={<IconUpload/>}
                label="Commit"
                onClick={() => {
                  commit(
                    ESDS.addr,
                    candidate
                  );
                }}
                disabled={user === '' || s !== 'Approved'}
              />
          </div>
        </div>
      </div>
    </Box>
  );
}

export default Commit;
