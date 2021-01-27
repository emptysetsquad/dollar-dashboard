import React from 'react';
import styled from 'styled-components'
import {Row, Column} from '../helpers'
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const logoUrl = `./logo/logo_${false ? 'black' : 'white'}.svg`;

  return (
    <Wrapper>
      <Section>
            <NavLink to="/" external={false} style={{ marginRight: '16px', height: '40px' }}>
              <img src={logoUrl} height="40px" alt="Empty Set Dollar" />
            </NavLink>
           <Row w={'auto'}>
              <Button href={'https://emptyset.finance/'} target={'_blank'} >Home</Button>
              <Button href={'https://docs.emptyset.finance/'} target={'_blank'} >Documentation</Button>
              <Button href={'https://explore.duneanalytics.com/dashboard/empty-set-dollar'} target={'_blank'} >Analytics</Button>
              <Button href={'https://app.uniswap.org/#/swap?inputCurrency=0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48&outputCurrency=0x36f3fd68e7325a35eb768f1aedaae9ea0689d723'} target={'_blank'} >Trade</Button>
            </Row>
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
  height: 150px;
  width: 100%;
  max-width: 1200px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`

const Button = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 16px;
  font-size: 14px;
  height: 40px;
  color: white !important; 
`
export default Footer;
