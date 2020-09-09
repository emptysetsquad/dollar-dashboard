import React from 'react';

import BigNumber from 'bignumber.js';

type BlanceBlockProps = {
  asset: string,
  balance: BigNumber | string | number
  suffix?: string
}

function padZeros(nDecimalStr, len, suffix=true) {
  while (nDecimalStr.length < len) {
    if (suffix) {
      nDecimalStr += '0'
    } else {
      nDecimalStr = '0' + nDecimalStr;
    }
  }
  return nDecimalStr;
}

function extractNum(nDecimalStr, start, len) {
  return padZeros(nDecimalStr.substr(start, len), len);
}

function round(nDecimalStr, precision) {
  const rounded = Math.round(parseInt(extractNum(nDecimalStr, 0, precision + 1)) / 10).toString();
  return padZeros(rounded, precision, false);
}

function sigfigs(nDecimalStr, sigfigs) {
  let position = 0;
  for (let i = 0; i < nDecimalStr.length; i++) {
    if (nDecimalStr[i] !== '0') {
      position = i;
      break;
    }
  }

  return nDecimalStr.substr(0, position) + round(nDecimalStr.substr(position), sigfigs)
}

function delineate(nIntegerStr) {
  let result = "";
  let group = 0;
  for (let i = nIntegerStr.length - 1; i >= 0; i--) {
    if (group === 3) {
      result = "," + result;
      group = 0;
    }
    result = nIntegerStr[i] + result;
    group++;
  }
  return result;
}

function BalanceBlock({ asset, balance, suffix=""}: BlanceBlockProps) {
  let integer = '0';
  let digits = '0';
  if (new BigNumber(balance).gt(new BigNumber(0))) {
    const str = new BigNumber(balance).toFixed();
    const split = str.split('.');
    integer = delineate(split[0]);
    digits = split.length > 1 ? str.split('.')[1] : '0';
    digits = integer === "0" ? sigfigs(digits, 2) : round(digits, 2)
    while (digits.length < 2) {
      digits += '0';
    }
  }

  return (
    <>
      <div style={{ fontSize: 14, padding: 3 }}>{asset}</div>
      <div style={{ padding: 3 }}>
        <span style={{ fontSize: 24 }}>{integer}</span>
        .
        <span style={{ fontSize: 18 }}>
          {' '}
          {digits}
          {' '}
        </span>
        {suffix === "" ? '' : <span style={{ fontSize: 18 }}>{suffix}</span> }
      </div>
    </>
  );
}

export default BalanceBlock;
