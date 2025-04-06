import React, { useEffect, useRef, useState } from "react";
import { Button, Dialog } from "@headlessui/react";
import { Paper } from "@mui/material";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SimplePeer from "simple-peer";
import Draggable from "react-draggable";
import {
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from "@heroicons/react/24/outline"; // Đảm bảo bạn đã import các icon cần thiết

import { useCall } from "../context/CallProvider";
import { useSocketContext } from "../context/socketProvider";
import { useConfirm } from "../context/ConfirmProvider";
import { PhoneXMarkIcon } from "@heroicons/react/24/outline";
import { getCurrentUser } from "../../service/user";
import UserStatusIndicator from "../UserStatusIndicator";

const CallModel = ({ isOpen, onClose, id }) => {
  const { socket } = useSocketContext();
  const confirm = useConfirm();
  const {
    incomingCall,
    setIncomingCall,
    isAccept,
    setIsAccept,
    setCallId,
    callId,
    isVideo,
    setIsVideo,
  } = useCall();
  const [stream, setStream] = useState(null);
  const [profileRender, setProfileRender] = useState(null);
  const [cameraOn, setCameraOn] = useState(true); // Camera state
  const myVideoRef = useRef(null);
  const partnerVideoRef = useRef(null);
  const draggableRef = useRef(null);
  const peerRef = useRef(null);
  const [isPartnerVideoOn, setIsPartnerVideoOn] = useState(true);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  useEffect(() => {
    if (!socket) return;
    socket.on("call-accept", handleCallAccept);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice-candidate", handleNewICECandidate);
    socket.on("camera-status", ({ status }) => {
      setIsPartnerVideoOn(status);
    });
    socket.on("end-call", handleEndCall);
    return () => {
      socket.off("call-accept", handleCallAccept);
      socket.off("answer", handleReceiveAnswer);
      socket.off("ice-candidate", handleNewICECandidate);
      socket.off("camera-status");
      socket.off("end-call", handleEndCall);
    };
  }, [socket]);

  useEffect(() => {
    if (!callId) return;
    const fetchProfile = async () => {
      const response = await getCurrentUser(callId);
      if (response && response.status === 200) {
        setProfileRender(response.data);
      } else {
        toast.error("Không thể lấy thông tin người dùng!");
      }
    };
    fetchProfile();
  }, [callId]);

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
  }, []);

  const handleEndCall = () => {
    if (isAccept || peerRef.current) {
      toast.error("Cuộc gọi kết thúc", { autoClose: 500 });
    }
    cleanupCall();
  };

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
  }, [isAccept, id]);

  const handleCallAccept = ({ caller, status }) => {
    if (!status) {
      toast.error("Cuộc gọi bị từ chối!");
      setIsVideo(false);
      cleanupCall();
    } else {
      setIsVideo(true);
    }
  };

  const startCall = async () => {
    if (!id) return;
    const isConfirmed = await confirm("Bạn có chắc muốn gọi?");
    if (!isConfirmed) {
      setCallId(null);
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
        setIsLoadingVideo(false); // Video loaded
        if (partnerVideoRef.current)
          partnerVideoRef.current.srcObject = remoteStream;
      });

      peerRef.current.on("error", (err) => {
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
        setIsLoadingVideo(false); // Video loaded
        if (partnerVideoRef.current)
          partnerVideoRef.current.srcObject = remoteStream;
      });

      peerRef.current.on("error", (err) => {
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
    // Reset all states
    setIsAccept(null);
    setIncomingCall(null);
    setCallId(null);
    setIsVideo(false);
    setCameraOn(true);
    setIsPartnerVideoOn(true);
    setProfileRender(null);

    // Notify server to end call
    endCallHand();

    // Destroy peer connection
    if (peerRef.current) {
      peerRef.current.removeAllListeners();
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Stop media stream
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
          stream.removeTrack(track);
        } catch (err) {
          console.warn("Lỗi khi stop/remove track:", err);
        }
      });
      setStream(null);
    }

    // Clear video elements
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = null;
    }
    if (partnerVideoRef.current) {
      partnerVideoRef.current.srcObject = null;
    }

    // Extra cleanup for possible ghost media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((tempStream) => {
        tempStream.getTracks().forEach((track) => track.stop());
      })
      .catch(() => {});

    onClose?.();
  };
  const endCallHand = async () => {
    if (socket && id) {
      return socket.emit("end-call", { target: id });
    }
  };

  // Toggle Camera function
  const toggleCamera = () => {
    if (!stream) return;
    const videoTrack = stream.getVideoTracks()[0];
    if (videoTrack.enabled) {
      videoTrack.enabled = false; // Turn off camera
      socket.emit("camera-status", { target: callId, status: false });
      setCameraOn(false);
    } else {
      videoTrack.enabled = true; // Turn on camera
      socket.emit("camera-status", { target: callId, status: true });
      setCameraOn(true);
    }
  };
  if (!id || !isAccept) return null;

  return (
    <>
      {isOpen && id && (
        <Dialog open={isOpen} onClose={cleanupCall}>
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "linear" }}
            className="fixed inset-0 flex items-center justify-center bg-opacity-50 bg-black px-0 z-50"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-[100dvh] sm:max-w-[70dvh] h-full max-h-[100dvh] w-full relative"
            >
              <div className="relative h-full w-full bg-black">
                {!isVideo && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded text-lg font-semibold z-40">
                    Đang gọi...
                  </div>
                )}

                {isLoadingVideo && (
                  <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-black">
                    <div className="spinner-border text-white" role="status">
                      <span className="sr-only">Đang lấy Camera người dùng...</span>
                    </div>
                  </div>
                )}
                <video
                  ref={partnerVideoRef}
                  autoPlay
                  className="w-full h-full rounded"
                  style={{
                    display:
                      isVideo && isPartnerVideoOn && !isLoadingVideo
                        ? "block"
                        : "none",
                  }}
                />
                {(!isPartnerVideoOn || !isVideo) && (
                  <div className="w-full h-full absolute top-0 left-0 flex justify-center items-center bg-black">
                    <div className="-w-24 aspect-square w-[40%] relative">
                      <UserStatusIndicator
                        userId={profileRender?._id}
                        userData={{ avatar: profileRender?.avatar }}
                        css={`w-full h-full rounded-full`}
                        styler={{
                          badge: {
                            size: "14px",
                          },
                        }}
                      />
                    </div>
                  </div>
                )}

                <Draggable bounds="parent" nodeRef={draggableRef}>
                  <div
                    ref={draggableRef}
                    className="absolute bottom-0 left-0 flex justify-center items-center cursor-grab w-1/5 bg-black aspect-square border border-gray-200 rounded overflow-hidden z-50"
                  >
                    <video
                      ref={myVideoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Draggable>
                <div className="z-40 fixed bottom-6 left-1/2 transform -translate-x-1/2">
                  <div className="flex gap-4 h-12 items-center">
                    {/* Toggle Camera Button */}
                    <button
                      onClick={toggleCamera}
                      className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium p-3 rounded-full shadow-md transition duration-200 w-12 h-12"
                    >
                      {/* Hiển thị icon tuỳ theo trạng thái camera */}
                      {cameraOn ? (
                        <VideoCameraSlashIcon className="w-6 h-6" />
                      ) : (
                        <VideoCameraIcon className="w-6 h-6" />
                      )}
                    </button>

                    {/* End Call Button */}
                    <button
                      onClick={cleanupCall}
                      className="bg-red-600 hover:bg-red-700 p-3 w-12 h-12 rounded-full shadow-md transition duration-200"
                      title="Kết thúc cuộc gọi"
                    >
                      <PhoneXMarkIcon className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Toggle Camera Button */}
              </div>
            </div>
          </motion.div>
        </Dialog>
      )}
    </>
  );
};

export default CallModel;
