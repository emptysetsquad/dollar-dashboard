import React from 'react';

import BigNumber from 'bignumber.js';

type NumberBlockProps = {
  title: string,
  num: BigNumber | string | number
}

function NumberBlock({ title, num }: NumberBlockProps) {
  const numNum = new BigNumber(num).toNumber();

  return (
    <>
      <div style={{ fontSize: 14, padding: 3 }}>{title}</div>
      <div style={{ fontSize: 24, padding: 3 }}>{numNum}</div>

    </>
  );
}

export default NumberBlock;
