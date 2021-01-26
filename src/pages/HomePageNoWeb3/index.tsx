import React from 'react';
import {
  Box, LinkBase, Tag,
} from '@aragon/ui';

function HomePageNoWeb3() {

  return (
    <>
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center' }}>
        <MainButton
          title="No web3 wallet detected"
          description="Click to get Metamask."
          icon={<i className="fas fa-times-circle"/>}
          onClick={() => {
            // @ts-ignore
            window.location = 'https://www.metamask.io/';
          }}
        />
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

export default HomePageNoWeb3;
