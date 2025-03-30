import React from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { PhoneXMarkIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { useCall } from "../context/CallProvider";
import { useSocketContext } from "../context/socketProvider";
import { useAuth } from "../context/AuthProvider";
import UserStatusIndicator from "../UserStatusIndicator";

const RequestCallModel = ({ isOpen, onClose }) => {
  const { incomingCall, setIncomingCall, setCallId, setIsAccept } = useCall();
  const { socket } = useSocketContext(); 

  if (!incomingCall) return null;

  const handleAccept = () => {
    socket.emit("call-accept", { target: incomingCall.caller, status: true });
    setCallId(incomingCall.caller);
    setIsAccept(true);
    onClose();
  };

  const handleReject = () => {
    setIsAccept(false);
    socket.emit("call-accept", { target: incomingCall.caller, status: false }); 
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleReject}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center"
      >
        <UserStatusIndicator
          userId={incomingCall?.caller}
          userData={{ avatar: incomingCall?.avatar }}
          styler={{
            button: { width: "100%", height: "100%" }, // ✅ Avatar full button
            avatar: { width: "100%", height: "100%" }, // ✅ Đảm bảo avatar không nhỏ hơn
            badge: {
              size: "14px", // ✅ Badge lớn hơn
            },
          }}
        />
        <p className="text-lg font-semibold mb-4">Cuộc gọi đến...</p>
        <div className="flex gap-8">
          <button
            onClick={handleReject}
            className="bg-red-500 p-4 rounded-full hover:bg-red-600"
          >
            <PhoneXMarkIcon className="w-8 h-8 text-white" />
          </button>
          <button
            onClick={handleAccept}
            className="bg-green-500 p-4 rounded-full hover:bg-green-600"
          >
            <PhoneIcon className="w-8 h-8 text-white" />
          </button>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default RequestCallModel;
