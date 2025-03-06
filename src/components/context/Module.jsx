import React, { createContext, useContext, useState, useEffect } from "react";
import Privacy from "../Auth/Privacy";

const ModuleContext = createContext();
export const ModuleProvider = ({ children }) => {
  const [usecase, setUsecase] = useState(null); 



  return (
    <ModuleContext.Provider value={{ usecase, setUsecase }}>
      {children}
      <Privacy isOpen={usecase=='Privacy'} onClose={() => setUsecase(null)} />
    </ModuleContext.Provider>
  );
};

export const useModule = () => useContext(ModuleContext);

