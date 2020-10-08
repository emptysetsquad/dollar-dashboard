import BigNumber from 'bignumber.js';

// eslint-disable-next-line import/prefer-default-export
export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1);
export const GOVERNANCE_QUORUM = new BigNumber('0.33');
