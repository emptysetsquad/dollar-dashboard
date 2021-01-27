import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { useWallet } from 'use-wallet';
import { Row, Column } from '../../components/helpers'
import styled from 'styled-components'

import { EpochBlock } from "../../components/common";

function epochformatted() {
  const epochStart = 1599148800;
  const epochPeriod = 8 * 60 * 60;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  let epochRemainder = unixTimeSec - epochStart
  const epoch = Math.floor(epochRemainder / epochPeriod);
  epochRemainder -= epoch * epochPeriod;
  const epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  const epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
  return `${epoch}-0${epochHour}:${epochMinute > 9 ? epochMinute : "0" + epochMinute.toString()}:${epochRemainder > 9 ? epochRemainder : "0" + epochRemainder.toString()}`;
}

function HomePage() {
  const { account } = useWallet();
  const history = useHistory();

  const [epochTime, setEpochTime] = useState("0-00:00:00");

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      if (!isCancelled) {
        setEpochTime(epochformatted())
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [account]);

  return (
    <>
      <Wrapper>
        <Column w={'100%'} style={{maxWidth: '1200px'}} m={'50px 0 0'}>
          <Title>Greeetings Traveller</Title>
          <Subtitle>Small conditional description here</Subtitle>
        </Column>
      </Wrapper>
      <ContentWrapper ai={'center'} >
        <CardRow>
          <Card>
            <CardTitle>Protocol Status</CardTitle>
            <Grid>
              <div>
                <InfoTitle>Status</InfoTitle>
                <b>Expanding</b>
              </div>
              <div>
                <InfoTitle>Current Epoch</InfoTitle>
                <div style={{width: '130px'}}>{epochTime}</div>
              </div>
              <div>
                <InfoTitle>Uniswap TWAP</InfoTitle>
                <div>1.034 USDC</div>
              </div>
              <div>
                <InfoTitle>Spot Price</InfoTitle>
                <div>0.9983 USDC</div>
              </div>
              <div>
                <InfoTitle>Protocol Debt</InfoTitle>
                <div>84,201,290 ESD</div>
              </div>
              <div>
                <InfoTitle>Purchased Coupons</InfoTitle>
                <div>32,892,199 ESD</div>
              </div>
            </Grid>
          </Card>  
          <Card>
            <CardTitle>Your Balance</CardTitle>
              <Row jc={'space-between'} ai={'center'} h={'100%'} w={'auto'}>
                <div>Please connect your wallet</div>
                <Button>Connect Wallet</Button>
              </Row>
          </Card>  
        </CardRow>
        <Infobox ai={'center'}>
          <h1>Need to know more?</h1>
          <Row>
            <InfoCard href={'https://docs.emptyset.finance/'} target={'_blank'}>
              <img src={'/graphics/new.png'} style={{width: '100%'}} />
              <h3>New to Empty Set Dollar?</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus, velit ac tincidunt ultrices, mauris arcu imperdiet </p>
            </InfoCard>
            <InfoCard href={'https://docs.emptyset.finance/faqs/bonding'} target={'_blank'}> 
              <img src={'/graphics/how.png'} style={{width: '100%'}}/>
              <h3>How do you use the DAO/LP?</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus, velit ac tincidunt ultrices, mauris arcu imperdiet </p>
            </InfoCard>
            <InfoCard href={'https://docs.emptyset.finance/faqs/risks'} target={'_blank'}>
              <img src={'/graphics/risks.png'} style={{width: '100%'}}/>
              <h3>Learn about the Risks?</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque luctus, velit ac tincidunt ultrices, mauris arcu imperdiet </p>
            </InfoCard>
          </Row>
        </Infobox>
      </ContentWrapper>
    </>
  );
}


const Title = styled.h1`
  color: ${({black}) => black ? 'black':'white'};
  margin-bottom: 0px;
  font-weight: bold;
`
const CardTitle = styled.h2`
  margin: 0px;
  font-weight: bold;
`
const InfoTitle = styled.h3`
  font-weight: 400;
  margin-bottom: 10px;
  color: #00D661;
`

const Subtitle = styled.p`
  color: white;
`
const ContentWrapper = styled(Column)`
  background: white;
  width: 100%;
  flex-grow: 1;
  margin: 150px 0 0;
  padding: 0 20px 50px;
  box-sizing: border-box;

`
const Infobox = styled(Column)`
  margin: 50px 0 0;
  max-width: 1200px;
  h3 {
    margin: 10px 0px 0px;
  }
  p {
    padding: 0px 10px;
    text-align: center;
    font-size: 14px;
    line-height: 32px;
  }
`
const InfoCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
  flex-grow: 1;
  :last-child {
    margin-right: 0px;
  }
`


const CardRow = styled(Row)`
  width: 100%;
  max-width: 1200px;
  margin: -97px 0 0;
`

const Card = styled(Column)`
  background: #FFFFFF;
  border: 1px solid #E8E8E8;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 34px 68px;
  margin-right: 30px;
  flex-grow: 1;
  max-width: calc(50% - 15px);
  :last-child {
    margin-right: 0px;
  }
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  grid-auto-rows: minmax(70px, auto);
`
const Button = styled.button`
  color: #00D661;
  border: 1px solid;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px 16px 6px;
  background: none;
  font-size: 18px;
  outline: none;
`

const Wrapper = styled(Row)`
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
  justify-content: center;
`
export default HomePage;
