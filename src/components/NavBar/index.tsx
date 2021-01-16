import React from 'react';
import { NavLink } from 'react-router-dom';

import { LinkBase, useTheme } from '@aragon/ui';
import ConnectButton from './ConnectButton';

type NavbarProps = {
  hasWeb3: boolean;
};

function NavBar({ hasWeb3 }: NavbarProps) {
  const currentTheme = useTheme();
  const logoUrl = `./logo/logo_${currentTheme._name === 'light' ? 'black' : 'white'}.svg`;

  return (
    <>
      <div
        style={{
          borderTop: '1px solid ' + currentTheme.border,
          backgroundColor: 'none',
          textAlign: 'center',
          height: '128px',
          width: '100%',
          fontSize: '14px',
        }}
      >
        <div style={{ maxWidth: '1100px', marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'flex', paddingTop: '24px' }}>
            <div style={{ width: '20%', textAlign: 'left' }}>
              <NavLink to="/" component={LinkBase} style={{ marginRight: '16px', height: '40px' }}>
                <img src={logoUrl} height="40px" alt="Empty Set Dollar" />
              </NavLink>
            </div>
            <div style={{ width: '60%', textAlign: 'center' }}>
              <LinkButton title="DAO" to="/dao/" />
              <LinkButton title="Liquidity" to="/pool/" />
              <LinkButton title="Regulation" to="/regulation/" />
              <LinkButton title="Governance" to="/governance/" />
              <LinkButton title="Trade" to="/trade/" />
              <LinkButton title="Coupons" to="/coupons/" />
            </div>
            <div style={{ width: '20%', textAlign: 'right' }}>
              <ConnectButton hasWeb3={hasWeb3} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

type linkButtonProps = {
  title: string;
  to: string;
};

function LinkButton({ title, to }: linkButtonProps) {
  return (
    <NavLink
      to={to}
      component={LinkBase}
      external={false}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        marginLeft: '8px',
        marginRight: '8px',
        height: '40px',
        opacity: 0.5,
      }}
      activeStyle={{ opacity: 1 }}
    >
      <span style={{ display: 'block', padding: '1%', fontSize: '17px' }}>{title}</span>
    </NavLink>
  );
}

export default NavBar;
