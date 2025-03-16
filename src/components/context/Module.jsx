import React, { createContext, useContext, useState, useEffect } from "react";
import Privacy from "../Auth/Privacy";
import EditProfile from "../Auth/EditProfile/EditProfile";
const ModuleContext = createContext();
export const ModuleProvider = ({ children }) => {
  const [usecase, setUsecase] = useState(null);
  const [usecase1, setUsecase1] = useState(null);

  return (
    <ModuleContext.Provider
      value={{ usecase, setUsecase, usecase1, setUsecase1 }}
    >
      {children}
      <Privacy isOpen={usecase == "Privacy"} onClose={() => setUsecase(null)} />
      <EditProfile
        isOpen={usecase == "EditProfile"}
        onClose={() => setUsecase(null)}
      />
    </ModuleContext.Provider>
  );
};

export const useModule = () => useContext(ModuleContext);
