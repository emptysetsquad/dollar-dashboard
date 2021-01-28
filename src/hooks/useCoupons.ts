import { useContext } from "react";

import { CouponsContext } from "../contexts/Coupons";

const useCoupons = () => {
  return {
    ...useContext(CouponsContext),
  };
};

export default useCoupons;
