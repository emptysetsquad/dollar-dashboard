import React, { useState } from 'react';

import {
  Button, IdentityBadge, IconConnect, Box, IconPower, LinkBase,
} from '@aragon/ui';

import { connect } from '../../utils/web3';
import TotalBalance from "./TotalBalance";

type connectButtonProps = {
  hasWeb3: boolean,
  user: string,
  setUser: Function
}

function ConnectButton({ hasWeb3, user, setUser }: connectButtonProps) {
  const [isConnected, setIsConnected] = useState(false);

  const connectWeb3 = async () => {
    const address = await connect();
    if (address === false) return;
    setIsConnected(true);
    setUser(address);
  };

  const disconnectWeb3 = async () => {
    setIsConnected(false);
    setUser('');
  };

  return isConnected ? (
    <div style={{display: 'flex'}}>
      <div style={{flex: '1'}}/>
      <div>
        <Box padding={4} style={{width: '192px'}}>
          <div style={{display: 'flex'}}>
            <div>
              <LinkBase onClick={disconnectWeb3} style={{marginRight: '8px', height: '24px'}}>
                <IconPower />
              </LinkBase>
            </div>
            <div style={{flex: '1', textAlign: 'right'}}>
              <IdentityBadge entity={user} />
            </div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1', textAlign: 'right'}}>
              <TotalBalance user={user} />
            </div>
          </div>
        </Box>
      </div>
    </div>
  ) : (
    <Button icon={<IconConnect />} label="Connect" onClick={connectWeb3} disabled={!hasWeb3}/>
  );
}


export default ConnectButton;
