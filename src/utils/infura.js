import Web3 from 'web3';

import BigNumber from 'bignumber.js';
import { UniswapV2Router02 } from '../constants/contracts';
import { ESD, UNI, USDC } from '../constants/tokens';

const dollarAbi = require('../constants/abi/Dollar.json');
const daoAbi = require('../constants/abi/Implementation.json');
const poolAbi = require('../constants/abi/Pool.json');
const uniswapRouterAbi = require('../constants/abi/UniswapV2Router02.json');
const uniswapPairAbi = require('../constants/abi/UniswapV2Pair.json');

// eslint-disable-next-line no-undef
const web3 = new Web3(ethereum);

/**
 *
 * @param {string} token address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getTokenBalance = async (token, account) => {
  if (account === '') return '0';
  const tokenContract = new web3.eth.Contract(dollarAbi, token);
  return tokenContract.methods.balanceOf(account).call();
};

export const getTokenTotalSupply = async (token) => {
  const tokenContract = new web3.eth.Contract(dollarAbi, token);
  return tokenContract.methods.totalSupply().call();
};

/**
 *
 * @param {string} token
 * @param {string} account
 * @param {string} spender
 * @return {Promise<string>}
 */
export const getTokenAllowance = async (token, account, spender) => {
  const tokenContract = new web3.eth.Contract(dollarAbi, token);
  return tokenContract.methods.allowance(account, spender).call();
};

// Døllar Protocol

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getBalanceBonded = async (dao, account) => {
  if (account === '') return '0';
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.balanceOfBonded(account).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getBalanceOfStaged = async (dao, account) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.balanceOfStaged(account).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getStatusOf = async (dao, account) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.statusOf(account).call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpoch = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.epoch().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpochTime = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.epochTime().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpochStart = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.epochStart().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getEpochPeriod = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.epochPeriod().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalDebt = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.totalDebt().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalRedeemable = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.totalRedeemable().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalBonded = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.totalBonded().call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getTotalStaged = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.totalStaged().call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getApproveFor = async (dao, candidate) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.approveFor(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getRejectFor = async (dao, candidate) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.rejectFor(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getStartFor = async (dao, candidate) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.startFor(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getPeriodFor = async (dao, candidate) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.periodFor(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} candidate address
 * @return {Promise<boolean>}
 */
export const getIsInitialized = async (dao, candidate) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.isInitialized(candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {string} candidate address
 * @return {Promise<string>}
 */
export const getRecordedVote = async (dao, account, candidate) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.recordedVote(account, candidate).call();
};

/**
 *
 * @param {string} dao address
 * @param {string} account address
 * @param {number} epoch number
 * @return {Promise<string>}
 */
export const getBalanceOfCoupons = async (dao, account, epoch) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.balanceOfCoupons(account, epoch).call();
};

/**
 *
 * @param {string} dao address
 * @param {number} epoch address
 * @return {Promise<string>}
 */
export const getOutstandingCoupons = async (dao, epoch) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.outstandingCoupons(epoch).call();
};

/**
 *
 * @param {string} dao address
 * @param {string|BigNumber} amount uint256
 * @return {Promise<string>}
 */
export const getCouponPremium = async (dao, amount) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.couponPremium(new BigNumber(amount).toFixed()).call();
};

/**
 *
 * @param {string} dao address
 * @return {Promise<string>}
 */
export const getImplementation = async (dao) => {
  const daoContract = new web3.eth.Contract(daoAbi, dao);
  return daoContract.methods.implementation().call();
};

// Uniswap Protocol

export const getCost = async (amount) => {
  const exchange = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
  // eslint-disable-next-line no-unused-vars
  const [inputAmount, _] = await exchange.methods.getAmountsIn(
    new BigNumber(amount).toFixed(),
    [USDC.addr, ESD.addr],
  ).call();
  return inputAmount;
};

export const getProceeds = async (amount) => {
  const exchange = new web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
  // eslint-disable-next-line no-unused-vars
  const [_, outputAmount] = await exchange.methods.getAmountsOut(
    new BigNumber(amount).toFixed(),
    [ESD.addr, USDC.addr],
  ).call();
  return outputAmount;
};

export const getInstantaneousPrice = async () => {
  const exchange = new web3.eth.Contract(uniswapPairAbi, UNI.addr);
  return exchange.methods.getReserves().call();
};

export const getToken0 = async () => {
  const exchange = new web3.eth.Contract(uniswapPairAbi, UNI.addr);
  return exchange.methods.token0().call();
};

// Pool

export const getPoolStatusOf = async (pool, account) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.statusOf(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfBonded = async (pool, account) => {
  if (account === '') return '0';
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfBonded(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfStaged = async (pool, account) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfStaged(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfRewarded = async (pool, account) => {
  if (account === '') return '0';
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfRewarded(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolBalanceOfClaimable = async (pool, account) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.balanceOfClaimable(account).call();
};

/**
 *
 * @param {string} pool address
 * @param {string} account address
 * @return {Promise<string>}
 */
export const getPoolTotalBonded = async (pool) => {
  const poolContract = new web3.eth.Contract(poolAbi, pool);
  return poolContract.methods.totalBonded().call();
};