import React, { useState } from 'react';
import { useWallet } from 'use-wallet';

import {
  Button, IdentityBadge, IconConnect, Box, IconPower, LinkBase,
} from '@aragon/ui';

import { connect } from '../../utils/web3';
import TotalBalance from "./TotalBalance";
import ConnectModal from './ConnectModal';

type connectButtonProps = {
  hasWeb3: boolean,
  user: string,
  setUser: Function
}

function ConnectButton({ hasWeb3, user, setUser }: connectButtonProps) {
  const { status, reset } = useWallet();

  const [isModalOpen, setModalOpen] = useState(false);

  const connectWeb3 = async (wallet) => {
    connect(wallet.ethereum);
    setUser(wallet.account);
  };

  const disconnectWeb3 = async () => {
    setUser('');
    reset();
  };

  const toggleModal = () => setModalOpen(!isModalOpen);

  return status === 'connected' ? (
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
    <>
      <ConnectModal visible={isModalOpen} onClose={toggleModal} onConnect={connectWeb3}/>
      <Button icon={<IconConnect />} label="Connect" onClick={toggleModal} disabled={!hasWeb3}/>
    </>
  );
}


export default ConnectButton;
