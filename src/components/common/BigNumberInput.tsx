import React from 'react';

import BigNumber from 'bignumber.js';
import {
  TextInput,
} from '@aragon/ui';

type BigNumberInputProps = {
  value: BigNumber,
  setter: (value: BigNumber) => void
  adornment?: any,
  disabled?: boolean
}

function BigNumberInput({ value, setter, adornment, disabled=false }: BigNumberInputProps) {
  return (
    <>
      <TextInput
        type="number"
        adornmentPosition="end"
        adornment={adornment}
        wide
        value={value.isNegative() ? '' : value.toFixed()}
        onChange={(event) => {
          if (event.target.value) {
            setter(new BigNumber(event.target.value));
          } else {
            setter(new BigNumber(-1));
          }
        }}
        onBlur={() => {
          if (value.isNegative()) {
            setter(new BigNumber(0))
          }
        }}
        disabled={disabled}
      />
    </>
  );
}

export default BigNumberInput;
