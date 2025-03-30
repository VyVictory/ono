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
export const CallProvider = ({ children }) => {
  const { profile } = useAuth();
  const { socket } = useSocketContext();
  const [callId, setCallId] = useState(null);
  const confirm = useConfirm();
  const [isAccept, setIsAccept] = useState(null);
  const [openRequest, setOpenRequest] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("offer", async ({ sdp, caller, profile }) => {
      if (!sdp || !caller) return;
      setIncomingCall({ sdp, caller, profile });
      setOpenRequest(true);
      // const isConfirmed = window.confirm("Có nhận cuộc gọi không ?");
      // if (isConfirmed) {
      //   console.log("Đã đồng ý cuộc gọi từ:", caller);
      //   socket.emit("call-accept", { target: caller, status: true });
      //   setCallId(caller); // Đảm bảo callId cập nhật đúng khi nhận cuộc gọi
      //   setIsAccept(true); // Đảm bảo trạng thái cập nhật đúng khi nhận cuộc gọi
      // } else {
      //   setIsAccept(false); // Đảm bảo trạng thái cập nhật đúng khi từ chối cuộc gọi
      //   socket.emit("call-accept", { target: caller, status: false });
      // }
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
      <RequestCallModel isOpen={openRequest} onClose={()=>{setOpenRequest(false)}}/>
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
