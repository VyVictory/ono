import React, { createContext, useContext, useState } from "react";
const SettingContext = createContext();
export const SettingProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <SettingContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = () => useContext(SettingContext);
