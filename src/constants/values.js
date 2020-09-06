import BigNumber from 'bignumber.js';

// eslint-disable-next-line import/prefer-default-export
export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1);
export const BOOTSTRAPPING_EPOCHS = 90;
export const BOOTSTRAPPING_EPOCH_SPEEDUP = 3;
export const BOOTSTRAPPING_ORACLE_PRICE = new BigNumber('1.10');
export const GOVERNANCE_QUORUM = new BigNumber('0.33');
