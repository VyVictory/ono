import React, { createContext, useContext, useState } from "react";
import { SocketProvider } from "../components/context/socketProvider";
import { ConfirmProvider } from "../components/context/ConfirmProvider";
import { ModuleProvider } from "../components/context/Module";
import { CallProvider } from "../components/context/CallProvider";
import { ProfileProvider } from "../components/context/profile/ProfileProvider";
import { DashboardProvider } from "../components/context/DashboardProvider";
const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [mainState, setMainState] = useState({});
  return (
    <MainContext.Provider value={{ mainState, setMainState }}>
      <ConfirmProvider>
        <SocketProvider>
          <ProfileProvider>
            <ModuleProvider>
              <DashboardProvider>
                <CallProvider>{children}</CallProvider>
              </DashboardProvider>
            </ModuleProvider>
          </ProfileProvider>
        </SocketProvider>
      </ConfirmProvider>
    </MainContext.Provider>
  );
};

export const useMain = () => useContext(MainContext);
