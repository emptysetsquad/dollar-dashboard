import React, {useEffect, useState} from 'react';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Main, Layout } from '@aragon/ui';
import { UseWalletProvider } from 'use-wallet';
import { updateModalMode } from './utils/web3';
import { storePreference, getPreference } from './utils/storage';
import NavBar from './components/NavBar';
import HomePage from './components/HomePage';
import Trade from './components/Trade/index';
import Footer from './components/Footer';
import Wallet from "./components/Wallet";
import EpochDetail from "./components/EpochDetail";
import CouponMarket from "./components/CouponMarket";
import Governance from "./components/Governance";
import Candidate from "./components/Candidate";
import Regulation from "./components/Regulation";
import Pool from "./components/Pool";
import HomePageNoWeb3 from "./components/HomePageNoWeb3";

function App() {
  const storedTheme = getPreference('theme', 'light');

  const [hasWeb3, setHasWeb3] = useState(false);
  const [theme, setTheme] = useState(storedTheme);

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    updateModalMode(newTheme);
    storePreference('theme', newTheme);
  };

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      if (!isCancelled) {
        // @ts-ignore
        setHasWeb3(typeof window.ethereum !== 'undefined');
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  });

  return (
    <Router>
      <UseWalletProvider
        chainId={1}
        connectors={{
          walletconnect: { rpcUrl: 'https://mainnet.eth.aragon.network/' },
          walletlink: {
            url: 'https://mainnet.eth.aragon.network/',
            appName:'Coinbase Wallet',
            appLogoUrl: ''
          }
        }}
      >
        <Main assetsUrl={`${process.env.PUBLIC_URL}/aragon-ui/`} theme={theme} layout={false}>
          <NavBar hasWeb3={hasWeb3} />
          <Layout>
          {
            hasWeb3 ?
              <Switch>
                <Route path="/dao/:override"><Wallet /></Route>
                <Route path="/dao/"><Wallet /></Route>
                <Route path="/epoch/"><EpochDetail /></Route>
                <Route path="/coupons/:override"><CouponMarket /></Route>
                <Route path="/coupons/"><CouponMarket /></Route>
                <Route path="/governance/candidate/:candidate"><Candidate /></Route>
                <Route path="/governance/"><Governance /></Route>
                <Route path="/trade/"><Trade /></Route>
                <Route path="/regulation/"><Regulation /></Route>
                <Route path="/pool/:override"><Pool /></Route>
                <Route path="/pool/"><Pool /></Route>
                <Route path="/"><HomePage /></Route>
              </Switch>
              :
              <Switch>
                <Route path="/"><HomePageNoWeb3/></Route>
              </Switch>
          }
          </Layout>
          <div style={{height: '128px', width: '100%'}}/>
          <Footer hasWeb3={hasWeb3} theme={theme} updateTheme={updateTheme}/>
        </Main>
      </UseWalletProvider>
    </Router>
  );
}


export default App;
