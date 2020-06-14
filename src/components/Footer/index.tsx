import React from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from '@aragon/ui';

function Footer({ theme } : { theme:string }) {
  const history = useHistory();

  return (
    history.location.pathname.includes('/trade/')
      ? <></>
      : (
        <div style={{
          backgroundColor: theme === 'light' ? '#F8F8F8' : '#35425e',
          textAlign: 'center',
          padding: '17px',
          position: 'fixed',
          left: '0',
          bottom: '0',
          height: '50px',
          width: '100%',
          fontSize: '14px'
        }}>
          made with <span role="img" aria-labelledby="heartbreak">💔️</span> by the &#123;ess&#125;.
        </div>
      )
  );
}

export default Footer;
