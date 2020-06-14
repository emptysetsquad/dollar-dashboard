import BigNumber from 'bignumber.js';

export const SLIPPAGE = new BigNumber("0.02");

export function increaseWithSlippage(n) {
  return new BigNumber(n).multipliedBy(new BigNumber(1).plus(SLIPPAGE)).integerValue(BigNumber.ROUND_FLOOR);
}

export function decreaseWithSlippage(n) {
  return new BigNumber(n).multipliedBy(new BigNumber(1).minus(SLIPPAGE)).integerValue(BigNumber.ROUND_FLOOR);
}
