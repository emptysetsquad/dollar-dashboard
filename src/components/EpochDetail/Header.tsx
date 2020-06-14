import React from 'react';

import NumberBlock from "../common/NumberBlock";

type AccountPageHeaderProps = {
  epoch: number,
  epochTime: number,
  epochStart: number,
  epochPeriod: number,
};

const EpochPageHeader = ({
  epoch, epochTime, epochStart, epochPeriod,
}: AccountPageHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Current" num={epoch} />
    </div>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Available" num={epochTime} />
    </div>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Start" num={epochStart} />
    </div>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Period" num={epochPeriod} />
    </div>
  </div>
);


export default EpochPageHeader;
