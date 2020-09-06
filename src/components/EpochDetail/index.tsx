import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {getEpoch, getEpochPeriod, getEpochStart, getEpochTime,
} from '../../utils/infura';
import {ESDS} from "../../constants/tokens";
import AdvanceEpoch from './AdvanceEpoch';
import EpochPageHeader from "./Header";
import IconHeader from "../common/IconHeader";
import {BOOTSTRAPPING_EPOCH_SPEEDUP, BOOTSTRAPPING_EPOCHS} from "../../constants/values";

function EpochDetail({ user }: {user: string}) {

  const [epoch, setEpoch] = useState(0);
  const [epochTime, setEpochTime] = useState(0);
  const [epochStart, setEpochStart] = useState(0);
  const [epochPeriod, setEpochPeriod] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [epochStr, epochTimeStr, epochStartStr, epochPeriodStr] = await Promise.all([
        getEpoch(ESDS.addr),
        getEpochTime(ESDS.addr),
        getEpochStart(ESDS.addr),
        getEpochPeriod(ESDS.addr),
      ]);

      if (!isCancelled) {
        setEpoch(parseInt(epochStr, 10));
        setEpochTime(parseInt(epochTimeStr, 10));
        setEpochStart(parseInt(epochStartStr, 10));
        setEpochPeriod(parseInt(epochPeriodStr, 10));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  });

  return (
    <>
      <IconHeader icon={<i className="fas fa-stream"/>} text="Epoch"/>

      <EpochPageHeader
        epoch={epoch}
        epochTime={epochTime}
        epochStart={epochStart}
        epochPeriod={epoch <= BOOTSTRAPPING_EPOCHS ? (epochPeriod / BOOTSTRAPPING_EPOCH_SPEEDUP) : epochPeriod}
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
