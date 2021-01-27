import React, { useState } from 'react';
import styled from 'styled-components'
import { Row } from '../helpers'

const Modal = ({visible, onClose, children}) => {
    return (
        <Wrapper visible={visible} onClick={() => onClose()} jc={'center'} ai={'center'} >
            <Box>
                {children}
            </Box>
        </Wrapper>
    )
}

const Wrapper = styled(Row)`
    width: 100vw;
    height: 100vh;
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    background: rgba(0%, 0%, 0%, 30%);
    visibility: ${({visible}) => visible ? 'visible' : 'hidden'};
    pointer-events: ${({visible}) => visible ? 'auto' : 'none'};;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
    min-height: 200px;
    width: 640px;
    background: white;
    padding: 40px 20px;
    z-index: 3;
    border-radius: 30px;
`

export default Modal