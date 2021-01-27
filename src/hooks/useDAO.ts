import { useContext } from "react";

import { DAOContext } from "../contexts/DAO";

const useDAO = () => {
  return {
    ...useContext(DAOContext),
  };
};

export default useDAO;
