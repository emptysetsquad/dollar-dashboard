import React, { useState, useEffect } from 'react';
import { Header, LinkBase, Box } from '@aragon/ui';
import { useHistory } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import {
  getTokenAllowance,
  getTokenBalance, getTokenTotalSupply,
} from '../../utils/infura';
import { toTokenUnitsBN } from '../../utils/number';

import TradePageHeader from './Header';
import UniswapBuySell from './UniswapBuySell';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';

import {ESD, UNI, USDC} from "../../constants/tokens";
import MintUSDC from "./MintUSDC";
import {UniswapV2Router02} from "../../constants/contracts";
import {MAX_UINT256} from "../../constants/values";
import UniswapApproveCollateral from "./UniswapApproveCollateral";
import UniswapApprovePoolToken from "./UniswapApprovePoolToken";
import IconHeader from "../common/IconHeader";

function isTestnet(): boolean {
  // @ts-ignore
  return parseInt(window.ethereum.networkVersion, 10) === 3
}

function unlockedCollateral(userAllowanceESD, userAllowanceUSDC) {
  return userAllowanceESD.comparedTo(MAX_UINT256) === 0 && userAllowanceUSDC.comparedTo(MAX_UINT256.dividedBy(2)) > 0;
}

function unlockedPoolToken(userAllowanceUNI) {
  return userAllowanceUNI.comparedTo(MAX_UINT256.dividedBy(2)) > 0;
}

function UniswapPool({ user }: {user: string}) {
  const history = useHistory();

  const [pairBalanceESD, setPairBalanceESD] = useState(new BigNumber(0));
  const [userBalanceESD, setUserBalanceESD] = useState(new BigNumber(0));
  const [pairBalanceUSDC, setPairBalanceUSDC] = useState(new BigNumber(0));
  const [userBalanceUSDC, setUserBalanceUSDC] = useState(new BigNumber(0));
  const [userBalanceUNI, setUserBalanceUNI] = useState(new BigNumber(0));
  const [userAllowanceESD, setUserAllowanceESD] = useState(new BigNumber(0));
  const [userAllowanceUSDC, setUserAllowanceUSDC] = useState(new BigNumber(0));
  const [userAllowanceUNI, setUserAllowanceUNI] = useState(new BigNumber(0));
  const [pairTotalSupplyUNI, setPairTotalSupplyUNI] = useState(new BigNumber(0));

  useEffect(() => {
    if (user === '') {
      setUserBalanceESD(new BigNumber(0));
      setUserBalanceUSDC(new BigNumber(0));
      setUserBalanceUNI(new BigNumber(0));
      setUserAllowanceESD(new BigNumber(0));
      setUserAllowanceUSDC(new BigNumber(0));
      setUserAllowanceUNI(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        userBalanceESDStr, userBalanceUSDCStr, userBalanceUNIStr,
        userAllowanceESDStr, userAllowanceUSDCStr, userAllowanceUNIStr
      ] = await Promise.all([
        getTokenBalance(ESD.addr, user),
        getTokenBalance(USDC.addr, user),
        getTokenBalance(UNI.addr, user),
        getTokenAllowance(ESD.addr, user, UniswapV2Router02),
        getTokenAllowance(USDC.addr, user, UniswapV2Router02),
        getTokenAllowance(UNI.addr, user, UniswapV2Router02),
      ]);

      if (!isCancelled) {
        setUserBalanceESD(toTokenUnitsBN(userBalanceESDStr, ESD.decimals));
        setUserBalanceUSDC(toTokenUnitsBN(userBalanceUSDCStr, USDC.decimals));
        setUserBalanceUNI(toTokenUnitsBN(userBalanceUNIStr, UNI.decimals));
        setUserAllowanceESD(new BigNumber(userAllowanceESDStr));
        setUserAllowanceUSDC(new BigNumber(userAllowanceUSDCStr));
        setUserAllowanceUNI(new BigNumber(userAllowanceUNIStr));
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        pairBalanceESDStr, pairBalanceUSDCStr, pairTotalSupplyUNIStr,
      ] = await Promise.all([
        getTokenBalance(ESD.addr, UNI.addr),
        getTokenBalance(USDC.addr, UNI.addr),
        getTokenTotalSupply(UNI.addr),
      ]);

      if (!isCancelled) {
        setPairBalanceESD(toTokenUnitsBN(pairBalanceESDStr, ESD.decimals));
        setPairBalanceUSDC(toTokenUnitsBN(pairBalanceUSDCStr, USDC.decimals));
        setPairTotalSupplyUNI(toTokenUnitsBN(pairTotalSupplyUNIStr, UNI.decimals));
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <>
      <IconHeader icon={<i className="fas fa-exchange-alt"/>} text="Trade"/>

      <TradePageHeader
        pairBalanceESD={pairBalanceESD}
        pairBalanceUSDC={pairBalanceUSDC}
        uniswapPair={UNI.addr}
      />

      <div style={{ padding: '1%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            title="Info"
            description="View ESD-USDC pool stats."
            icon={<i className="fas fa-chart-area"/>}
            href={"https://uniswap.info/pair/0x88ff79eb2bc5850f27315415da8685282c7610f9"}
          />
        </div>

        <div style={{ width: '30%' }}>
          <MainButton
            title="Trade"
            description="Trade døllar tokens."
            icon={<i className="fas fa-exchange-alt"/>}
            href={"https://uniswap.exchange/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x36f3fd68e7325a35eb768f1aedaae9ea0689d723"}
          />
        </div>

        <div style={{ width: '30%', marginLeft: '3%', marginRight: '2%' }}>
          <MainButton
            title="Supply"
            description="Supply and redeem liquidity."
            icon={<i className="fas fa-water"/>}
            href={"https://uniswap.exchange/add/0x36f3fd68e7325a35eb768f1aedaae9ea0689d723/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"}
          />
        </div>
      </div>

      {/*{unlockedCollateral(userAllowanceESD, userAllowanceUSDC) ?*/}
      {/*  <>*/}
      {/*    <UniswapBuySell*/}
      {/*      userBalanceESD={userBalanceESD}*/}
      {/*      pairBalanceESD={pairBalanceESD}*/}
      {/*    />*/}

      {/*    <Header primary="Provide Liquidity"/>*/}

      {/*    <AddLiquidity*/}
      {/*      userBalanceESD={userBalanceESD}*/}
      {/*      userBalanceUSDC={userBalanceUSDC}*/}
      {/*      pairBalanceESD={pairBalanceESD}*/}
      {/*      pairBalanceUSDC={pairBalanceUSDC}*/}
      {/*      pairTotalSupplyUNI={pairTotalSupplyUNI}*/}
      {/*    />*/}
      {/*  </>*/}
      {/*  :*/}
      {/*  <UniswapApproveCollateral*/}
      {/*    user={user}*/}
      {/*    userAllowanceESD={userAllowanceESD}*/}
      {/*    userAllowanceUSDC={userAllowanceUSDC}*/}
      {/*  />*/}
      {/*}*/}
      {/*{unlockedPoolToken(userAllowanceUNI) ?*/}
      {/*  <RemoveLiquidity*/}
      {/*    userBalanceUNI={userBalanceUNI}*/}
      {/*    pairBalanceESD={pairBalanceESD}*/}
      {/*    pairBalanceUSDC={pairBalanceUSDC}*/}
      {/*    pairTotalSupplyUNI={pairTotalSupplyUNI}*/}
      {/*  />*/}
      {/*  :*/}
      {/*  <UniswapApprovePoolToken*/}
      {/*    user={user}*/}
      {/*    userAllowanceUNI={userAllowanceUNI}*/}
      {/*  />*/}
      {/*}*/}


      {/*{isTestnet() ?*/}
      {/*  <>*/}
      {/*    <Header primary="Mint Testnet USDC" />*/}

      {/*    <MintUSDC*/}
      {/*      user={user}*/}
      {/*      userBalanceUSDC={userBalanceUSDC}*/}
      {/*    />*/}
      {/*  </>*/}
      {/*: '' }*/}

    </>
  );
}

type MainButtonProps = {
  title: string,
  description: string,
  icon: any,
  href:string
}

function MainButton({
  title, description, icon, href,
}:MainButtonProps) {
  return (
    <LinkBase href={href} style={{ width: '100%' }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
        </div>
        <span style={{ fontSize: 48 }}>
          {icon}
        </span>
        {/*<img alt="icon" style={{ padding: 10, height: 64 }} src={iconUrl} />*/}
        <div style={{ paddingTop: 5, opacity: 0.5 }}>
          {' '}
          {description}
          {' '}
        </div>

      </Box>
    </LinkBase>
  );
}

export default UniswapPool;
