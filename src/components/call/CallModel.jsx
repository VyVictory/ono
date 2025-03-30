import React, { useEffect, useRef, useState } from "react";
import { Button, Dialog } from "@headlessui/react";
import { Paper } from "@mui/material";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SimplePeer from "simple-peer";
import { useCall } from "../context/CallProvider";
import { useSocketContext } from "../context/socketProvider";
import { useConfirm } from "../context/ConfirmProvider";
const CallModel = ({ isOpen, onClose, id }) => {
 
  const { socket } = useSocketContext();
  const confirm = useConfirm();

  const { incomingCall, setIncomingCall, isAccept, setIsAccept } = useCall();
  const [stream, setStream] = useState(null);
  const [cssOpen, setCssOpen] = useState('');
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
      cleanupCall(  );
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
    }

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    // Xóa nguồn stream khỏi video elements
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = null;
    }
    if (partnerVideoRef.current) {
      partnerVideoRef.current.srcObject = null;
    }
    setIsAccept(null);
    setIncomingCall(null);
    onClose();
  };

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
            onClick={cleanupCall}
          >
            <Paper
              onClick={(e) => e.stopPropagation()}
              className="max-w-[100dvh] lg:max-w-[90dvh] h-full max-h-[100dvh] lg:max-h-[80dvh] border-2 relative"
            >
              <div className="p-4">
                <div className="mt-4 flex gap-4">
                  <video
                    ref={myVideoRef}
                    autoPlay
                    muted
                    className="w-1/2 border rounded"
                  />
                  <video
                    ref={partnerVideoRef}
                    autoPlay
                    className="w-1/2 absolute bottom-0 left-0 border rounded"
                  />
                </div>
              </div>
            </Paper>
          </motion.div>
        </Dialog>
      )}
    </>
  );
};

export default CallModel;
