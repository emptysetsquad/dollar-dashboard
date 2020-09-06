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