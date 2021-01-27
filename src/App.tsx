import React, {useEffect, useState} from 'react';
import styled, {createGlobalStyle} from 'styled-components'

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Main, Layout } from '@aragon/ui';
import { UseWalletProvider } from 'use-wallet';
import { updateModalMode } from './utils/web3';
import { storePreference, getPreference } from './utils/storage';

import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import HomePageNoWeb3 from "./pages/HomePageNoWeb3";
// import Trade from './pages/Trade/index';
// import Wallet from "./pages/Wallet";
// import EpochDetail from "./pages/EpochDetail";
// import CouponMarket from "./pages/CouponMarket";
// import Governance from "./pages/Governance";
// import Candidate from "./pages/Candidate";
// import Regulation from "./pages/Regulation";
// import Pool from "./pages/Pool";

const GlobalStyles = createGlobalStyle`
   @font-face {
    font-family: 'HKGrotesk';
    font-style: normal;
    font-weight: 700;
    font-display: block;
    src: url(fonts/HKGrotesk-Bold.otf)
      format('opentype');
  }
   @font-face {
    font-family: 'HKGrotesk';
    font-style: normal;
    font-weight: 400;
    font-display: block;
    src: url(fonts/HKGrotesk-Regular.otf)
      format('opentype');
  }
   @font-face {
    font-family: 'HKGrotesk';
    font-style: normal;
    font-weight: 300;
    font-display: block;
    src: url(fonts/HKGrotesk-Light.otf)
      format('opentype');
  }

  body {
    margin: 0;
    font-family: 'HKGrotesk', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: black;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
  a {
    text-decoration: none;
    color: default;
    :visited {
      color: black;
    }
  }
`

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
      <GlobalStyles/>
        {/* <Main assetsUrl={`${process.env.PUBLIC_URL}/aragon-ui/`} theme={theme} layout={false}> */}
        <Content>
          <NavBar hasWeb3={hasWeb3} />
          {/* <Layout> */}
          {
            hasWeb3 ?
              <Switch>
                {/* <Route path="/dao/:override"><Wallet /></Route>
                <Route path="/dao/"><Wallet /></Route> */}
                {/* <Route path="/epoch/"><EpochDetail /></Route>
                <Route path="/coupons/:override"><CouponMarket /></Route>
                <Route path="/coupons/"><CouponMarket /></Route>
                <Route path="/governance/candidate/:candidate"><Candidate /></Route>
                <Route path="/governance/"><Governance /></Route>
                <Route path="/trade/"><Trade /></Route>
                <Route path="/regulation/"><Regulation /></Route>
                <Route path="/pool/:override"><Pool /></Route>
                <Route path="/pool/"><Pool /></Route> */}
                <Route path="/"><HomePage /></Route>
              </Switch>
              :
              <Switch>
                <Route path="/"><HomePageNoWeb3/></Route>
              </Switch>
          }
          {/* </Layout> */}
          <Footer />
        </Content>
        {/* </Main> */}
      </UseWalletProvider>
    </Router>
  );
}

const Content = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`

export default App;
