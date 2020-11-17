import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {
  Header, Box, LinkBase, Tag,
} from '@aragon/ui';
import TextBlock from "../common/TextBlock";
import BigNumber from "bignumber.js";
import EpochBlock from "../common/EpochBlock";

function epochformatted() {
  const epochStart = 1599148800;
  const epochPeriod = 8 * 60 * 60;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  let epochRemainder = unixTimeSec - epochStart
  const epoch = Math.floor(epochRemainder / epochPeriod);
  epochRemainder -= epoch * epochPeriod;
  console.log(epochRemainder)
  const epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  console.log(epochRemainder)
  const epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
  console.log(epochRemainder)
  return `${epoch}-0${epochHour}:${epochMinute > 9 ? epochMinute : "0" + epochMinute.toString()}:${epochRemainder > 9 ? epochRemainder : "0" + epochRemainder.toString()}`;
}

type HomePageProps = {
  user: string
};

function HomePage({user}: HomePageProps) {
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
  }, [user]);

  return (
    <>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginLeft: '3%' }}>
          <Header primary="døllar." />
        </div>
        <div style={{ flexBasis: '35%' }} />
        <div style={{ flexBasis: '30%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <Box>
            <EpochBlock epoch={epochTime}/>
          </Box>
        </div>
      </div>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            title="Wallet"
            description="Manage døllar balance and bonding."
            icon={<i className="fas fa-wallet"/>}
            onClick={() => {
              history.push('/wallet/');
            }}
          />
        </div>

        <div style={{ flexBasis: '30%' }}>
          <MainButton
            title="Governance"
            description="Vote on upgrades."
            icon={<i className="fas fa-poll"/>}
            onClick={() => {
              history.push('/governance/');
            }}
          />
        </div>

        <div style={{ flexBasis: '30%', marginLeft: '3%', marginRight: '2%' }}>
          <MainButton
            title="Regulation"
            description="Network supply regulation statistics."
            icon={<i className="fas fa-chart-area"/>}
            onClick={() => {
              history.push('/regulation/');
            }}
          />
        </div>
      </div>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flexBasis: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            title="Trade"
            description="Trade døllar tokens."
            icon={<i className="fas fa-exchange-alt"/>}
            onClick={() => {
              history.push('/trade/');
            }}
          />
        </div>

        <div style={{ flexBasis: '30%' }}>
          <MainButton
            title="LP Rewards"
            description="Earn rewards for providing liquidity."
            icon={<i className="fas fa-parachute-box"/>}
            onClick={() => {
              history.push('/pool/');
            }}
          />
        </div>

        <div style={{ flexBasis: '30%', marginLeft: '3%', marginRight: '2%'  }}>
          <MainButton
            title="Coupons"
            description="Purchase and redeem coupons."
            icon={<i className="fas fa-ticket-alt"/>}
            onClick={() => {
              history.push('/coupons/');
            }}
          />
        </div>
      </div>
    </>
  );
}

type MainButtonPropx = {
  title: string,
  description: string,
  icon: any,
  onClick: Function,
  tag?:string
}

function MainButton({
  title, description, icon, onClick, tag,
}:MainButtonPropx) {
  return (
    <LinkBase onClick={onClick} style={{ width: '100%' }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
          {tag ? <Tag>{tag}</Tag> : <></>}
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

export default HomePage;
