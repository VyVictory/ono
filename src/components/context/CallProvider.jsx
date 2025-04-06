import React, { createContext, useContext, useState, useEffect } from "react";
import CallModel from "../call/CallModel";
import { useSocketContext } from "./socketProvider";
import { toast } from "react-toastify";
import { Button, Dialog } from "@headlessui/react";
import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { Paper } from "@mui/material";
const CallContext = createContext();
import { useConfirm } from "./ConfirmProvider";
import RequestCallModel from "../call/RequestCallModel";
import { isCancel } from "axios";
export const CallProvider = ({ children }) => {
  const { profile } = useAuth();
  const { socket } = useSocketContext();
  const [callId, setCallId] = useState(null);
  const confirm = useConfirm();
  const [isAccept, setIsAccept] = useState(null);
  const [isVideo, setIsVideo] = useState(null);
  const [openRequest, setOpenRequest] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("offer", async ({ sdp, caller, profile }) => {
      if (!sdp || !caller) return;
      setIncomingCall({ sdp, caller, profile });
      setOpenRequest(true);
    });

    return () => {
      socket.off("offer");
    };
  }, [socket]);

  return (
    <CallContext.Provider
      value={{
        setCallId,
        callId,
        isVideo,
        setIsVideo,
        incomingCall,
        setIncomingCall,
        isAccept,
        setIsAccept,
      }}
    >
      {children}
      {callId && (
        <CallModel isOpen={true} onClose={() => setCallId(null)} id={callId} />
      )}
      <RequestCallModel
        isOpen={openRequest}
        onClose={() => {
          setOpenRequest(false);
        }}
      />
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
