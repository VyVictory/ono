import React, { createContext, useContext, useState, useEffect } from "react";
import CallModel from "../call/CallModel";
import { useSocketContext } from "./socketProvider";
const CallContext = createContext();
export const CallProvider = ({ children }) => {
  const { socket } = useSocketContext();
  const [callId, setCallId] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  return (
    <CallContext.Provider
      value={{
        setCallId,
        callId,
        incomingCall,
        setIncomingCall,
      }}
    >
      {children}
      <CallModel
        isOpen={callId != null}
        onClose={() => {
          setCallId(null);
        }}
        id={callId}
        socket={socket}
      />
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
