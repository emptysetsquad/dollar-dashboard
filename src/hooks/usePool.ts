import { useContext } from "react";

import { PoolContext } from "../contexts/Pool";

const usePool = () => {
  return {
    ...useContext(PoolContext),
  };
};

export default usePool;
