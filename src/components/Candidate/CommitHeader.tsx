import React from 'react';

import NumberBlock from "../common/NumberBlock";

type CommitHeaderProps = {
  epoch: number
  startEpoch: number,
  periodEpoch: number,
};

const CommitHeader = ({
   epoch, startEpoch, periodEpoch,
}: CommitHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Epoch" num={epoch} />
    </div>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Starts" num={startEpoch} />
    </div>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Period" num={periodEpoch} />
    </div>
  </div>
);


export default CommitHeader;
