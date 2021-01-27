import React, { useEffect } from 'react';
// import { Modal, Button, Header } from '@aragon/ui';
import { useWallet } from 'use-wallet';
import styled from 'styled-components'
import Modal from '../Modal'

type ConnectModalProps = {
  visible: boolean,
  onClose: Function,
  onConnect: Function
};

function ConnectModal({
  visible, onClose, onConnect
}:ConnectModalProps) {
  const { account, connect } = useWallet();

  const handleConnect = (connector) => {
    connect(connector);
  };

  useEffect(() => {
    if (account) {
      onConnect && onConnect();
      onClose && onClose();
    }
  }, [account, onConnect, onClose]);

  return (
    <Modal visible={true} onClose={onClose}>
        <Header>{"Select a wallet provider"}</Header>
        <Button
          wide
          label={'Metamask'}
          icon={<img src={`./wallets/metamask-fox.svg`} style={{ height: 24 }} alt="Metamask"/>}
          onClick={() => {handleConnect('injected')}}
        />
        <Button
          wide
          label={'WalletConnect'}
          icon={<img src={`./wallets/wallet-connect.svg`} style={{ height: 24 }} alt="WalletConnect"/>}
          onClick={() => {handleConnect('walletconnect')}}
        />
        <Button
          wide
          label={'Coinbase Wallet'}
          icon={<img src={`./wallets/coinbase-wallet.png`} style={{ height: 24 }} alt="Coinbase Wallet"/>}
          onClick={() => {handleConnect('walletlink')}}
        />
    </Modal>
  );
}

const Button = ({wide, label, icon, onClick}) => {
  return (
    <StyledButton wide={wide} onClick={onClick}>
      <span>{icon}</span>
      <div>{label}</div>
    </StyledButton>
  )
}

const Header = styled.h2`
  margin: 0px 0px 20px;
`

const StyledButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px 6px;
  background: #00D661;
  color: white;
  border-radius: 8px;
  outline: none;
  border: none;
  font-size: 18px;
  width: ${({wide}) => wide ? '250px': 'auto'};
  margin: 5px 0;
  span {
    margin-right: 10px;
  }
  div {
    flex-grow: 1;
  }
  
`


export default ConnectModal;
