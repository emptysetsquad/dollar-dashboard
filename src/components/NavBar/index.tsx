import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Bar, BackButton, LinkBase } from '@aragon/ui';
import ConnectButton from './ConnectButton';
import ChangeModeButton from './SwitchTheme';

type NavbarProps = {
  theme:string,
  updateTheme: Function,
  user: string,
  setUser: Function
}

function NavBar({
  theme, updateTheme, user, setUser,
}:NavbarProps) {
  const history = useHistory();
  const [isHome, updateIsHome] = useState(true);
  const [page, setPage] = useState("");

  useEffect(() => {
    const home = history.location.pathname === '/';
    updateIsHome(home);
    return history.listen((location) => {
      setPage(location.pathname)
      const home = history.location.pathname === '/';
      updateIsHome(home);
    })
  }, [user, history]);

  return (
    <Bar
      primary={
        isHome ? (
          <></>
        ) : (
          <>
            <div style={{ height: '100%' }}>
              <BackButton
                onClick={() => {
                  history.goBack();
                }}
              />
            </div>
            <LinkButton
              title="Home"
              onClick={() => {
                history.push('/');
              }}
              isSelected={page === '/'}
            />
            <LinkButton
              title="Wallet"
              onClick={() => {
                history.push('/wallet/');
              }}
              isSelected={page.includes('/wallet')}
            />
            <LinkButton
              title="Epoch"
              onClick={() => {
                history.push('/epoch/');
              }}
              isSelected={page.includes('/epoch')}
            />
            <LinkButton
              title="Coupons"
              onClick={() => {
                history.push('/coupons/');
              }}
              isSelected={page.includes('/coupons')}
            />
            <LinkButton
              title="Governance"
              onClick={() => {
                history.push('/governance/');
              }}
              isSelected={page.includes('/governance')}
            />
            <LinkButton
              title="Trade"
              onClick={() => {
                history.push('/trade/');
              }}
              isSelected={page.includes('/trade')}
            />
          </>
        )
      }
      secondary={(
        <>
          <ConnectButton user={user} setUser={setUser} />
          <ChangeModeButton theme={theme} updateTheme={updateTheme} />
        </>
      )}
    />
  );
}


type linkButtonProps = {
  title:string,
  onClick: Function,
  isSelected?:boolean
}

function LinkButton({ title, onClick, isSelected = false }:linkButtonProps) {
  return (
    <div style={{ paddingLeft: 40 }}>
      <LinkBase onClick={onClick}>
        <div style={{ padding: '1%', opacity: isSelected ? 1 : 0.5, fontSize: 17 }}>{title}</div>
      </LinkBase>
    </div>
  );
}

export default NavBar;
