import React from "react";
import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { PhoneXMarkIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { useCall } from "../context/CallProvider";
import { useSocketContext } from "../context/socketProvider";
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
        className="bg-white rounded-2xl p-6 shadow-lg flex flex-col items-center h-[100dvh] lg:h-[96dvh] w-full lg:w-[60dvh] max-w-300px"
      >
        {/* Avatar động khi có cuộc gọi đến */}
        <div className=" flex flex-grow flex-col items-center justify-center">
          <motion.div
            className="relative flex aspect-square items-center justify-center"
            // animate={{ scale: [1, 1.1, 1] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <UserStatusIndicator
              userId={incomingCall?.caller}
              userData={{ avatar: incomingCall?.avatar }}
              styler={{
                button: { width: "200px", height: "200px" },
                avatar: { width: "100%", height: "100%" },
                badge: { size: "14px" },
              }}
            />
            {/* Viền phát sáng động */}
            <motion.div
              className="absolute w-full h-full rounded-full border-4 border-green-500"
              animate={{ opacity: [1, 0.5, 0], scale: [1, 1.2] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          </motion.div>
          <p className="text-lg font-semibold mt-4">Cuộc gọi đến...</p>
        </div>

        <div className="flex gap-8 mt-4">
          <button
            onClick={handleReject}
            className="bg-red-500 p-4 rounded-full hover:bg-red-600"
          >
            <PhoneXMarkIcon className="w-8 h-8 text-white" />
          </button>
          <motion.button
            onClick={handleAccept}
            className="bg-green-500 p-4 rounded-full hover:bg-green-600"
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }} // Lắc khi hover
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatType: "reverse",
            }} // Lặp vô hạn
          >
            <PhoneIcon className="w-8 h-8 text-white" />
          </motion.button>
        </div>
      </motion.div>
    </Dialog>
  );
};

export default RequestCallModel;
