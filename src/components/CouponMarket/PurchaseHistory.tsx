import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, Button, IconRight,
} from '@aragon/ui';

import {getCouponEpochs} from '../../utils/web3';
import {ESDS} from "../../constants/tokens";
import TextBlock from "../common/TextBlock";

type PurchaseHistoryProps = {
  user: string,
};

function PurchaseHistory({
  user,
}: PurchaseHistoryProps) {
  const history = useHistory();
  const [epochs, setEpochs] = useState([]);

  //Update User balances
  useEffect(() => {
    if (user === '') return;
    let isCancelled = false;

    async function updateUserInfo() {
      const [epochsFromEvents] = await Promise.all([
        getCouponEpochs(ESDS.addr),
      ]);

      if (!isCancelled) {
        // @ts-ignore
        setEpochs(epochsFromEvents);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <Box heading="History">
      {epochs.map((epoch) => {
        return <div style={{display: 'flex'}} key={epoch}>
          {/* Epoch */}
          <div style={{width: '30%'}}>
            <TextBlock label="Epoch" text={epoch}/>
          </div>
          <div style={{width: '38%'}}/>
          {/* Go To */}
          <div style={{ width: '30%', paddingTop: '2%' }}>
            <Button
              wide
              icon={<IconRight />}
              label="Go To"
              onClick={() => {
                history.push(`/coupons/epoch/${epoch}`);
              }}
            />
          </div>
        </div>
      })}
    </Box>
  );
}

export default PurchaseHistory;
