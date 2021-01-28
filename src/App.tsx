import React, {useEffect, useState} from 'react';

import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import { Main, Layout } from '@aragon/ui';
import { UseWalletProvider } from 'use-wallet';
import { updateModalMode } from './utils/web3';
import { storePreference, getPreference } from './utils/storage';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Trade from './pages/Trade/index';
import Footer from './components/Footer';
import Wallet from "./pages/Wallet";
import EpochDetail from "./pages/EpochDetail";
import CouponMarket from "./pages/CouponMarket";
import Governance from "./pages/Governance";
import Candidate from "./pages/Candidate";
import Regulation from "./pages/Regulation";
import Pool from "./pages/Pool";
import HomePageNoWeb3 from "./pages/HomePageNoWeb3";

import { BalancesProvider } from "./contexts/Balances";
import { CouponsProvider } from "./contexts/Coupons";
import { DAOProvider } from "./contexts/DAO";
import { GovernanceProvider } from "./contexts/Governance";
import { PoolProvider } from "./contexts/Pool";

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
      <Providers>
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
      </Providers>
    </Router>
  );
}

const Providers: React.FC = ({ children }) => {
  return (
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
      <BalancesProvider>
        <CouponsProvider>
          <DAOProvider>
            <GovernanceProvider>
              <PoolProvider>
                { children }
              </PoolProvider>
            </GovernanceProvider>
          </DAOProvider>
        </CouponsProvider>
      </BalancesProvider>
    </UseWalletProvider>
  );
};

export default App;
