import React, { createContext, useContext, useState } from "react";
const DashboardContext = createContext();
export const DashboardProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <DashboardContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
