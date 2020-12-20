/* eslint-disable camelcase */
import Web3 from 'web3';
import BigNumber from 'bignumber.js';

import { notify } from './txNotifier.ts';
import { UniswapV2Router02 } from '../constants/contracts';

import { ESD, USDC } from '../constants/tokens';

const uniswapRouterAbi = require('../constants/abi/UniswapV2Router02.json');
const testnetUSDCAbi = require('../constants/abi/TestnetUSDC.json');
const daoAbi = require('../constants/abi/Implementation.json');
const poolAbi = require('../constants/abi/Pool.json');

const DEADLINE_FROM_NOW = 60 * 15;
const UINT256_MAX = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

/**
 * Connection Utilities
 */

export const updateModalMode = async (theme) => {
  window.darkMode = theme === 'dark';
};

export const connect = async (ethereum) => {
  window.web3 = new Web3(ethereum);
  let addresses = await window.web3.eth.getAccounts();
  if (!addresses.length) {
    try {
      addresses = await window.ethereum.enable();
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  return addresses.length ? addresses[0].toLowerCase() : null;
};

// eslint-disable-next-line consistent-return
export const checkConnectedAndGetAddress = async () => {
  let addresses = await window.web3.eth.getAccounts();
  if (!addresses.length) {
    try {
      addresses = await window.ethereum.enable();
      // eslint-disable-next-line no-empty
    } catch (e) { }
  }

  return addresses[0];
};

/**
 * ERC20 Utilities
 */

export const approve = async (tokenAddr, spender, amt = UINT256_MAX) => {
  const account = await checkConnectedAndGetAddress();
  const oToken = new window.web3.eth.Contract(testnetUSDCAbi, tokenAddr);
  await oToken.methods
    .approve(spender, amt)
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const mintTestnetUSDC = async (amount) => {
  const account = await checkConnectedAndGetAddress();
  const usdc = new window.web3.eth.Contract(testnetUSDCAbi, USDC.addr);

  await usdc.methods.mint(account, new BigNumber(amount).toFixed())
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

/**
 * Uniswap Protocol
 */

export const buyESD = async (buyAmount, maxInputAmount) => {
  const account = await checkConnectedAndGetAddress();
  const router = new window.web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

  await router.methods.swapTokensForExactTokens(
    buyAmount,
    maxInputAmount,
    [USDC.addr, ESD.addr],
    account,
    deadline,
  )
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const sellESD = async (sellAmount, minOutputAmount) => {
  const account = await checkConnectedAndGetAddress();
  const router = new window.web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

  await router.methods.swapExactTokensForTokens(
    sellAmount,
    minOutputAmount,
    [ESD.addr, USDC.addr],
    account,
    deadline,
  )
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const addLiquidity = async (amountESD, amountUSDC, slippage) => {
  const account = await checkConnectedAndGetAddress();
  const router = new window.web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;
  const slippageBN = new BigNumber(slippage);
  const minAmountESD = new BigNumber(amountESD)
    .multipliedBy(new BigNumber(1).minus(slippageBN))
    .integerValue(BigNumber.ROUND_FLOOR);
  const minAmountUSDC = new BigNumber(amountUSDC)
    .multipliedBy(new BigNumber(1).minus(slippageBN))
    .integerValue(BigNumber.ROUND_FLOOR);

  await router.methods.addLiquidity(
    ESD.addr,
    USDC.addr,
    new BigNumber(amountESD).toFixed(),
    new BigNumber(amountUSDC).toFixed(),
    minAmountESD,
    minAmountUSDC,
    account,
    deadline,
  )
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const removeLiquidity = async (liquidityAmount, minAmountESD, minAmountUSDC) => {
  const account = await checkConnectedAndGetAddress();
  const router = new window.web3.eth.Contract(uniswapRouterAbi, UniswapV2Router02);
  const deadline = Math.ceil(Date.now() / 1000) + DEADLINE_FROM_NOW;

  await router.methods.removeLiquidity(
    ESD.addr,
    USDC.addr,
    new BigNumber(liquidityAmount).toFixed(),
    new BigNumber(minAmountESD).toFixed(),
    new BigNumber(minAmountUSDC).toFixed(),
    account,
    deadline,
  )
    .send({ from: account })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

/**
 * Døllar Protocol
 */

export const advance = async (dao) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .advance()
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const deposit = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .deposit(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const withdraw = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .withdraw(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const bond = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .bond(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const unbond = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .unbond(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const unbondUnderlying = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .unbondUnderlying(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const purchaseCoupons = async (dao, amount) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .purchaseCoupons(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const redeemCoupons = async (dao, epoch, amount) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .redeemCoupons(epoch, new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const recordVote = async (dao, candidate, voteType) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .vote(candidate, voteType)
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

export const commit = async (dao, candidate) => {
  const account = await checkConnectedAndGetAddress();
  const daoContract = new window.web3.eth.Contract(daoAbi, dao);
  await daoContract.methods
    .commit(candidate)
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
    });
};

/* UNI-V2 Incentivization Pool */
export const depositPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .deposit(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const withdrawPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .withdraw(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const bondPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .bond(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const unbondPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .unbond(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const claimPool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .claim(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};

export const providePool = async (pool, amount, callback) => {
  const account = await checkConnectedAndGetAddress();
  const poolContract = new window.web3.eth.Contract(poolAbi, pool);
  await poolContract.methods
    .provide(new BigNumber(amount).toFixed())
    .send({
      from: account,
    })
    .on('transactionHash', (hash) => {
      notify.hash(hash);
      callback(hash);
    });
};
