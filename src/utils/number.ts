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
  if (amount.isLessThan(new BigNumber(1))) {
    return pad(amount.precision(position, BigNumber.ROUND_FLOOR).toFixed(), position);

  }
  return delineate(amount.toFixed(position, BigNumber.ROUND_FLOOR));
}

function delineate(bnStr) {
  const parts = bnStr.split('.');
  return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "." + parts[1];
}

function pad(bnStr, position) {
  if (!bnStr.includes(".")) {
    bnStr += ".";
  }

  const parts = bnStr.split(".");
  for (let i = 0; i < position - parts[1].length; i++) {
    bnStr += "0";
  }

  return bnStr
}

export function formatMoney(n) {
  n = n.toPrecision(3)
  return Math.abs(Number(n)) >= 1.0e+9
    ? Math.abs(Number(n)) / 1.0e+9 + "B"
    : Math.abs(Number(n)) >= 1.0e+6
      ? Math.abs(Number(n)) / 1.0e+6 + "MM"
      : Math.abs(Number(n)) >= 1.0e+3
        ? Math.abs(Number(n)) / 1.0e+3 + "K"
        : Math.abs(Number(n));
}