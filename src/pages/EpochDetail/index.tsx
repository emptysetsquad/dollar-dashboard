import React from 'react';
import { Header } from '@aragon/ui';

import useDAO from "../../hooks/useDAO";

import { IconHeader } from "../../components/common";
import AdvanceEpoch from './AdvanceEpoch';
import EpochPageHeader from "./Header";

function EpochDetail() {
  const { epoch, epochTime } = useDAO();

  return (
    <>
      <IconHeader icon={<i className="fas fa-stream"/>} text="Epoch"/>

      <EpochPageHeader
        epoch={epoch}
        epochTime={epochTime}
      />

      <Header primary="Advance Epoch" />

      <AdvanceEpoch
        epoch={epoch}
        epochTime={epochTime}
      />
    </>
  );
}

export default EpochDetail;
