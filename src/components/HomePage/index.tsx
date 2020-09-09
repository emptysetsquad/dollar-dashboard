import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Header, Box, LinkBase, Tag,
} from '@aragon/ui';

function HomePage() {
  const history = useHistory();

  return (
    <>
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center' }}>
        <div style={{ marginLeft: '2%'  }}>
          <Header primary="døllar dashboard." />
        </div>
      </div>
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            title="Wallet"
            description="Manage døllar balance and bonding."
            icon={<i className="fas fa-wallet"/>}
            onClick={() => {
              history.push('/wallet/');
            }}
          />
        </div>

        <div style={{ width: '30%' }}>
          <MainButton
            title="Epoch"
            description="View and advance the current epoch."
            icon={<i className="fas fa-stream"/>}
            onClick={() => {
              history.push('/epoch/');
            }}
          />
        </div>

        <div style={{ width: '30%', marginLeft: '3%', marginRight: '2%' }}>
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
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginRight: '3%', marginLeft: '2%'  }}>
          <MainButton
            title="Trade"
            description="Trade døllar tokens."
            icon={<i className="fas fa-exchange-alt"/>}
            onClick={() => {
              history.push('/trade/');
            }}
          />
        </div>

        <div style={{ width: '30%' }}>
          <MainButton
            title="LP Rewards"
            description="Earn rewards for providing liquidity."
            icon={<i className="fas fa-parachute-box"/>}
            onClick={() => {
              history.push('/pool/');
            }}
          />
        </div>

        <div style={{ width: '30%', marginLeft: '3%', marginRight: '2%'  }}>
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
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '30%', marginLeft: '35%', marginRight: '35%' }}>
          <MainButton
            title="Governance"
            description="Vote on upgrades."
            icon={<i className="fas fa-poll"/>}
            onClick={() => {
              history.push('/governance/');
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
