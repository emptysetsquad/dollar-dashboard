import React, { useState, useEffect } from 'react';
import { useWallet } from 'use-wallet';

import {
  Button, IdentityBadge, IconConnect, Box, IconPower, LinkBase,
} from '@aragon/ui';

import { connect } from '../../utils/web3';
import { storePreference, getPreference, removePreference } from '../../utils/storage';
import TotalBalance from "./TotalBalance";
import ConnectModal from './ConnectModal';

type connectButtonProps = {
  hasWeb3: boolean;
}

function ConnectButton({ hasWeb3 }: connectButtonProps) {
  const wallet = useWallet();

  const [isModalOpen, setModalOpen] = useState(false);

  const connectWeb3 = async () => {
    if (wallet.account) {
      storePreference('account', wallet.account);
      storePreference('walletProvider', wallet.connector);
      connect(wallet.ethereum);
    }
  };

  const disconnectWeb3 = async () => {
    removePreference('account');
    removePreference('walletProvider');
    setModalOpen(false);
    wallet.reset();
  };

  const toggleModal = () => setModalOpen(!isModalOpen);

  useEffect(() => {
    const localAccount = getPreference('account', '');
    const walletProvider = getPreference('walletProvider', '');

    if (!wallet.account && localAccount !== '' && walletProvider !== '') {
      if (walletProvider === 'injected')
        wallet.connect('injected');
      else if (walletProvider === 'walletconnect')
        wallet.connect('walletconnect');
      else if (walletProvider === 'walletlink')
        wallet.connect('walletlink');
    }
  });

  return wallet.status === 'connected' ? (
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
              <IdentityBadge entity={wallet.account || ''} />
            </div>
          </div>
          <div style={{display: 'flex'}}>
            <div style={{flex: '1', textAlign: 'right'}}>
              <TotalBalance user={wallet.account || ''} />
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
