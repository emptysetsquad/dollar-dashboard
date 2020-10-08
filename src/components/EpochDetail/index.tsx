import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {getEpoch, getEpochTime,
} from '../../utils/infura';
import {ESDS} from "../../constants/tokens";
import AdvanceEpoch from './AdvanceEpoch';
import EpochPageHeader from "./Header";
import IconHeader from "../common/IconHeader";

function EpochDetail({ user }: {user: string}) {

  const [epoch, setEpoch] = useState(0);
  const [epochTime, setEpochTime] = useState(0);
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [epochStr, epochTimeStr] = await Promise.all([
        getEpoch(ESDS.addr),
        getEpochTime(ESDS.addr),
      ]);

      if (!isCancelled) {
        setEpoch(parseInt(epochStr, 10));
        setEpochTime(parseInt(epochTimeStr, 10));
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
    <>
      <IconHeader icon={<i className="fas fa-stream"/>} text="Epoch"/>

      <EpochPageHeader
        epoch={epoch}
        epochTime={epochTime}
      />

      <Header primary="Advance Epoch" />

      <AdvanceEpoch
        user={user}
        epoch={epoch}
        epochTime={epochTime}
      />
    </>
  );
}

export default EpochDetail;
