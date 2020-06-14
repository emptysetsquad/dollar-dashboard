import React from 'react';

import {
  Header,
} from '@aragon/ui';

type IconHeaderProps = {
  icon: any,
  text: string
}

function IconHeader({ icon, text }: IconHeaderProps) {
  return (
    <>
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '2%', fontSize: 48 }}>
          {icon}
        </div>
        <div>
          <Header primary={text} />
        </div>
      </div>
    </>
  );
}

export default IconHeader;
