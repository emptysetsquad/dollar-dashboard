import React, { useEffect } from 'react';
import { Modal, Button, Header } from '@aragon/ui';
import { useWallet } from 'use-wallet';

type ConnectModalProps = {
  visible: boolean,
  onClose: Function,
  onConnect: Function
};

function ConnectModal({
  visible, onClose, onConnect
}:ConnectModalProps) {
  const wallet = useWallet();

  const connectMetamask = () => {
    wallet.connect("injected");
  };

  const connectWalletConnect = () => {
    wallet.connect("walletconnect");
  };

  const connectCoinbase = () => {
    wallet.connect("walletlink");
  };

  useEffect(() => {
    if (wallet.account) {
      onConnect && onConnect(wallet);
      onClose && onClose();
    }
  }, [wallet, onConnect, onClose]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <Header primary="Select a wallet provider" />

      <div style={{width: '50%', margin: 'auto', padding: '1%'}}>
        <Button
          wide
          label={'Metamask'}
          icon={<img src={`./wallets/metamask-fox.svg`} style={{ height: 24 }} alt="Metamask"/>}
          onClick={connectMetamask}
        />
      </div>
      <div style={{width: '50%', margin: 'auto', padding: '1%'}}>
        <Button
          wide
          label={'WalletConnect'}
          icon={<img src={`./wallets/wallet-connect.svg`} style={{ height: 24 }} alt="WalletConnect"/>}
          onClick={connectWalletConnect}
        />
      </div>
      <div style={{width: '50%', margin: 'auto', padding: '1%'}}>
        <Button
          wide
          label={'Coinbase Wallet'}
          icon={<img src={`./wallets/coinbase-wallet.png`} style={{ height: 24 }} alt="Coinbase Wallet"/>}
          onClick={connectCoinbase}
        />
      </div>
    </Modal>
  );
}

export default ConnectModal;
