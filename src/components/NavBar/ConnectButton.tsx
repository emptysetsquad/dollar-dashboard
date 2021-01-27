import React, { useState, useEffect } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components'
import {Row, Column} from '../helpers'


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
      <Button onClick={disconnectWeb3}>
          {wallet.account ? wallet.account.slice(0,5) + '...' + wallet.account.slice(-5, -1) : ''}
      </Button>
  ) : (
    <>
      <ConnectModal visible={isModalOpen} onClose={toggleModal} onConnect={connectWeb3}/>
      <Button onClick={toggleModal} disabled={!hasWeb3}>Connect Wallet</Button>
    </>
  );
}

const Button = styled.button`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px 6px;
  background: #00D661;
  color: white;
  border-radius: 8px;
  outline: none;
  border: none;
  font-size: 18px;
`

export default ConnectButton;
