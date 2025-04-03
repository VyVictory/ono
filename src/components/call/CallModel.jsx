import React, { useEffect, useRef, useState } from "react";
import { Button, Dialog } from "@headlessui/react";
import { Paper } from "@mui/material";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SimplePeer from "simple-peer";
import Draggable from "react-draggable";

import { useCall } from "../context/CallProvider";
import { useSocketContext } from "../context/socketProvider";
import { useConfirm } from "../context/ConfirmProvider";
import { PhoneXMarkIcon } from "@heroicons/react/24/outline";

const CallModel = ({ isOpen, onClose, id }) => {
  const { socket } = useSocketContext();
  const confirm = useConfirm(); 
  const { incomingCall, setIncomingCall, isAccept, setIsAccept } = useCall();
  const [stream, setStream] = useState(null);
  const [cssOpen, setCssOpen] = useState("");
  const myVideoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const peerRef = useRef(null);
  useEffect(() => {
    if (!socket) return;
    socket.on("call-accept", handleCallAccept);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice-candidate", handleNewICECandidate);

    socket.on("end-call", cleanupCall);
    return () => {
      socket.off("call-accept", handleCallAccept);
      socket.off("answer", handleReceiveAnswer);
      socket.off("ice-candidate", handleNewICECandidate);

      socket.off("end-call", cleanupCall);
    };
  }, [socket]);
  useEffect(() => {
    if (!id || isAccept) return;
    startCall();
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, [id]);
  useEffect(() => {
    if (!isAccept) return;
    if (!id) return;
    acceptCall();
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    };
  }, [isAccept, id]); // Ensure `id` is included
  const handleCallAccept = ({ caller, status }) => {
    console.log("Cuộc gọi từ:", caller, "đã được chấp nhận:", status);
    if (!status) {
      toast.error("Cuộc gọi bị từ chối!");
      cleanupCall();
    } else {
      toast.success("Cuộc gọi được chấp nhận!");
    }
  };

  const startCall = async () => {
    if (!id) return;
    const isConfirmed = await confirm("Bạn có chắc muốn gọi?");
    if (!isConfirmed) {
      cleanupCall();
      return;
    }
    setIsAccept(true);
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userStream);
      if (myVideoRef.current) myVideoRef.current.srcObject = userStream;

      peerRef.current = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: userStream,
      });

      peerRef.current.on("signal", (data) => {
        socket.emit("offer", { target: id, sdp: data });
      });

      peerRef.current.on("stream", (remoteStream) => {
        if (partnerVideoRef.current)
          partnerVideoRef.current.srcObject = remoteStream;
      });

      peerRef.current.on("error", (err) => {
        cleanupCall();
        console.error("WebRTC Error:", err);
        toast.error("Lỗi kết nối, vui lòng thử lại!");
        cleanupCall();
      });
    } catch (error) {
      cleanupCall();
      console.error("Lỗi truy cập thiết bị:", error);
      toast.error("Không thể truy cập camera/micro!");
    }
  };

  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userStream);
      if (myVideoRef.current) myVideoRef.current.srcObject = userStream;

      peerRef.current = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: userStream,
      });

      peerRef.current.signal(incomingCall.sdp);

      peerRef.current.on("signal", (data) => {
        socket.emit("answer", { target: incomingCall.caller, sdp: data });
      });

      peerRef.current.on("stream", (remoteStream) => {
        if (partnerVideoRef.current)
          partnerVideoRef.current.srcObject = remoteStream;
      });

      peerRef.current.on("error", (err) => {
        cleanupCall();
        console.error("WebRTC Error:", err);
        toast.error("Lỗi kết nối, vui lòng thử lại!");
        cleanupCall();
      });

      setIncomingCall(null);
    } catch (error) {
      console.error("Lỗi khi truy cập thiết bị:", error);
      cleanupCall();
      toast.error("Không thể truy cập camera/micro!");
    }
  };

  const handleReceiveAnswer = ({ sdp }) => {
    if (!peerRef.current || !sdp) return;
    peerRef.current.signal(sdp);
  };

  const handleNewICECandidate = ({ candidate }) => {
    if (peerRef.current && candidate) {
      peerRef.current.signal(candidate);
    }
  };

  const cleanupCall = () => {
    if (socket && id) {
      socket.emit("end-call", { target: id });
      socket.disconnect(); // Ngắt kết nối socket nếu không cần nữa
    }
  
    if (peerRef.current && typeof peerRef.current.destroy === "function") {
      peerRef.current.destroy();
      peerRef.current = null;
    }
  
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
        stream.removeTrack(track); 
      });
      setStream(null);
    }
  
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = null;
    }
    if (partnerVideoRef.current) {
      partnerVideoRef.current.srcObject = null;
    }
  
    setIsAccept(null);
    setIncomingCall(null);
  
    // Tắt hoàn toàn quyền truy cập camera/micro (chỉ có tác dụng sau khi tải lại trang)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((tempStream) => {
        tempStream.getTracks().forEach(track => track.stop());
      });
  
    onClose(); // Đóng UI hoặc thực hiện hành động kết thúc cuộc gọi
  };
  
  // setIsAccept(null);
  //   setIncomingCall(null);
  //   onClose();
  if (!id || !isAccept) return null;
  return (
    <>
      {/* Modal gọi điện (mở sau khi chấp nhận) */}
      {isOpen && id && (
        <Dialog open={isOpen} onClose={cleanupCall}>
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black lg:px-0 z-50"
          >
            <Paper
              onClick={(e) => e.stopPropagation()}
              className="max-w-[100dvh] lg:max-w-[90dvh] h-full max-h-[100dvh] border-2"
            >
              <div className=" relative h-full w-full bg-black ">
                <video
                  ref={partnerVideoRef}
                  autoPlay
                  muted
                  className="w-full h-full border rounded"
                />
                <Draggable bounds="parent">
                  <div className="absolute bottom-0 left-0 flex justify-center items-center cursor-grab w-1/5 bg-black aspect-square border rounded">
                    <video ref={myVideoRef} autoPlay className=" " />
                  </div>
                </Draggable>
                <button
                  onClick={() => cleanupCall()}
                  className="bg-red-500 p-4 rounded-full hover:bg-red-600 z-50 fixed bottom-5 left-1/2 transform -translate-x-1/2"
                >
                  <PhoneXMarkIcon className="w-12 h-12 text-white" />
                </button>
              </div>
            </Paper>
          </motion.div>
        </Dialog>
      )}
    </>
  );
};

export default CallModel;
