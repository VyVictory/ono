import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Paper } from "@mui/material";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SimplePeer from "simple-peer";

const CallModel = ({ isOpen, onClose, id, socket }) => {
  const [myId, setMyId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [stream, setStream] = useState(null);
  const myVideoRef = useRef();
  const partnerVideoRef = useRef();
  const peerRef = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  useEffect(() => {
    if (!id) return;
    setPartnerId(id);
  }, [id]);
  useEffect(() => {
    if (!socket) return;

    setMyId(socket.id);

    socket.on("offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice-candidate", handleNewICECandidate);

    return () => {
      socket.off("offer", handleReceiveOffer);
      socket.off("answer", handleReceiveAnswer);
      socket.off("ice-candidate", handleNewICECandidate);
    };
  }, [socket]);

  const startCall = async () => {
    console.log("startCall");

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(userStream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = userStream;
      }

      // Khởi tạo peer trước khi gọi bất kỳ sự kiện nào trên nó
      peerRef.current = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: userStream,
      });

      // Kiểm tra nếu peerRef đã tồn tại trước khi gán sự kiện
      if (!peerRef.current) {
        console.error("Peer connection failed to initialize.");
        return;
      }

      peerRef.current.on("error", (err) => {
        console.error("WebRTC Error:", err);
        alert("Kết nối bị gián đoạn, vui lòng thử lại!");
      });

      peerRef.current.on("signal", (data) => {
        socket.emit("offer", { target: partnerId, sdp: data });
      });

      peerRef.current.on("stream", (remoteStream) => {
        if (partnerVideoRef.current) {
          partnerVideoRef.current.srcObject = remoteStream;
        }
      });

      peerRef.current.on("ice-candidate", (candidate) => {
        socket.emit("ice-candidate", { target: partnerId, candidate });
      });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleReceiveOffer = ({ sdp, caller }) => {
    if (!sdp || !caller) return;
    setIncomingCall({ sdp, caller });
  };

  // Khi người nhận bấm nút nhận
  const acceptCall = async () => {
    if (!incomingCall || !incomingCall.sdp || !incomingCall.caller) return;

    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(userStream);
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = userStream;
      }

      peerRef.current = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: userStream,
      });

      peerRef.current.signal(incomingCall.sdp);

      peerRef.current.on("signal", (data) => {
        if (socket) {
          socket.emit("answer", { target: incomingCall.caller, sdp: data });
        }
      });

      peerRef.current.on("stream", (remoteStream) => {
        if (partnerVideoRef.current) {
          partnerVideoRef.current.srcObject = remoteStream;
        }
      });

      setIncomingCall(null); // Xóa thông báo cuộc gọi
    } catch (error) {
      console.error("Lỗi khi truy cập thiết bị:", error);
    }
  };

  const handleReceiveAnswer = ({ sdp }) => {
    if (!sdp || !peerRef.current) return;
    peerRef.current.signal(sdp);
  };

  const handleNewICECandidate = (data) => {
    if (!data || !data.candidate || !peerRef.current) return;
    peerRef.current.signal(data.candidate);
  };
  if (!id) return <></>;

  return (
    <>
      <Dialog open={isOpen} onClose={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "linear" }}
          className="fixed inset-0 flex items-center justify-center   bg-opacity-50 bg-black px-4 lg:px-0 z-50"
          onClick={onClose}
        >
          <Paper
            onClick={(e) => e.stopPropagation()}
            className="w-96 max-w-[90dvh] border-2"
          >
            <div className="p-4">
              {incomingCall && (
                <div className="p-4 bg-yellow-100 border">
                  <p>Cuộc gọi đến từ {incomingCall.caller}</p>
                  <button
                    onClick={acceptCall}
                    className="p-2 bg-green-500 text-white rounded"
                  >
                    Chấp nhận
                  </button>
                </div>
              )}
              <h2>My ID: {myId}</h2>
              {/* <input
                type="text"
                placeholder="Nhập ID đối tác"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
              /> */}
              <button
                onClick={startCall}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Gọi
              </button>

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
                  className="w-1/2 border rounded"
                />
              </div>
            </div>
          </Paper>
        </motion.div>
      </Dialog>
    </>
  );
};

export default CallModel;
