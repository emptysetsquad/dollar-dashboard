import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components'

import {Row, Column} from '../helpers'
// import { LinkBase, useTheme } from '@aragon/ui';
import ConnectButton from './ConnectButton';

type NavbarProps = {
  hasWeb3: boolean;
};

function NavBar({ hasWeb3 }: NavbarProps) {
  // const currentTheme = useTheme();
  const logoUrl = `./logo/logo_${false ? 'black' : 'white'}.svg`;

  return (
    <Wrapper>
      <Section>
            <NavLink to="/" external={false} style={{ marginRight: '16px', height: '40px' }}>
              <img src={logoUrl} height="40px" alt="Empty Set Dollar" />
            </NavLink>
            <Row w={'auto'}>
              <Button to="/staking/" external={false} >Staking</Button>
              <Button to="/coupons/" external={false} >Coupons</Button>
              <Button to="/regulation/" external={false} >Regulation</Button>
              <Button to="/governance/" external={false} >Governance</Button>
              {/* <LinkButton title="Liquidity" to="/pool/" /> */}
              {/* <LinkButton title="Trade" to="/trade/" /> */}
            </Row>
            <ConnectButton hasWeb3={hasWeb3} />
      </Section>
    </Wrapper>
  );
}

const Wrapper = styled(Row)`
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
  justify-content: center;
  @media (max-width: 960px) {
      padding: 20px 20px;
  }
`

const Section = styled.header`
  background: none;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100px;
  width: 100%;
  max-width: 1200px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`

const Button = styled(NavLink)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
  font-size: 14px;
  height: 40px;
  color: white !important; 
`


export default NavBar;
