import React, { useState } from 'react';
import { Modal, Button, useTheme } from '@aragon/ui';
import { getPreference, storePreference } from "../../utils/storage";
import { COUPON_EXPIRATION } from "../../constants/values";

function ModalWarning() {
  const storedShowWarning = getPreference('showCouponWarning', '1');
  const [showWarning, setShowWarning] = useState(storedShowWarning === '1');
  const theme = useTheme();

  return (
    <Modal visible={showWarning} closeButton={false}>
      <div style={{ width: '100%' }}>
        <div style={{ fontSize: 24, padding: 3, color: theme.warning }}>
          Warning
        </div>

        <div style={{
          marginLeft: '3%',
          fontSize: 16,
          padding: 5
        }}>
          <div>
            Coupons will only become redeemable during the next supply
            expansion. Each expansionary epoch, a tranche of rewards are
            reserved for coupon redemptions by the DAO. At that time, the
            redemption process is first come, first served. If coupons are not
            redeemed within {COUPON_EXPIRATION} epochs of purchase, they can be
            redeemed for the original purchase price and the premium is forfeited.
          </div>

          <div style={{
            padding: 10,
            textAlign: 'center',
            color: theme.warningSurfaceContent
          }}>
            Coupon premiums and redemption timing are not guaranteed.
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button
            label={'I understand'}
            onClick={() => {
              storePreference('showCouponWarning', '0');
              setShowWarning(false);
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

export default ModalWarning;
