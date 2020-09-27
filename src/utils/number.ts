import BigNumber from 'bignumber.js';

/**
 * Convert 10.999 to 10999000
 */
export function toBaseUnitBN(rawAmt:string| number| BigNumber, decimals: number):BigNumber {
  const raw = new BigNumber(rawAmt);
  const base = new BigNumber(10);
  const decimalsBN = new BigNumber(decimals);
  return raw.times(base.pow(decimalsBN)).integerValue();
}

/**
 * Convert 10999000 to 10.999
 */
export const toTokenUnitsBN = (tokenAmount:string|number|BigNumber, tokenDecimals:number): BigNumber => {
  const amt = new BigNumber(tokenAmount);
  const digits = new BigNumber(10).pow(new BigNumber(tokenDecimals));
  return amt.div(digits);
};

export const isPos = (amount: BigNumber): boolean => {
  return !amount.isZero() && amount.isPositive();
};

export const ownership = (balance: BigNumber, totalSupply: BigNumber): BigNumber => {
  return balance.multipliedBy(new BigNumber(100)).dividedBy(totalSupply);
}

/**
 * BigNumber string formatting
 */

export const formatBN = (amount: BigNumber, position: number): string => {
  const str = new BigNumber(amount).toFixed();
  const split = str.split('.');
  let integer = delineate(split[0]);
  let digits = split.length > 1 ? str.split('.')[1] : '0';
  digits = integer === "0" ? sigfigs(digits, position) : round(digits, position)
  while (digits.length < position) {
    digits += '0';
  }
  return integer + '.' + digits;
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