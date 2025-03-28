import React, { useEffect, useRef, useState } from "react";
import SimplePeer from "simple-peer";
import { useSocketContext } from "../components/context/socketProvider";

const VideoCall = () => {
  const { socket } = useSocketContext();
  const [myId, setMyId] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [stream, setStream] = useState(null);
  const myVideoRef = useRef();
  const partnerVideoRef = useRef();
  const peerRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    setMyId(socket.id);

    socket.on("user-joined", handleUserJoined);
    socket.on("offer", handleReceiveOffer);
    socket.on("answer", handleReceiveAnswer);
    socket.on("ice-candidate", handleNewICECandidate);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("offer", handleReceiveOffer);
      socket.off("answer", handleReceiveAnswer);
      socket.off("ice-candidate", handleNewICECandidate);
    };
  }, [socket]);

  const startCall = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(userStream);
      myVideoRef.current.srcObject = userStream;

      peerRef.current = new SimplePeer({
        initiator: true,
        trickle: false,
        stream: userStream,
      });

      peerRef.current.on("signal", (data) => {
        socket.emit("offer", { target: partnerId, sdp: data });
      });

      peerRef.current.on("stream", (remoteStream) => {
        partnerVideoRef.current.srcObject = remoteStream;
      });

      peerRef.current.on("ice-candidate", (candidate) => {
        socket.emit("ice-candidate", { target: partnerId, candidate });
      });

    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleUserJoined = (id) => {
    setPartnerId(id);
  };

  const handleReceiveOffer = async ({ sdp, caller }) => {
    try {
      setPartnerId(caller);
      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(userStream);
      myVideoRef.current.srcObject = userStream;

      peerRef.current = new SimplePeer({
        initiator: false,
        trickle: false,
        stream: userStream,
      });

      peerRef.current.signal(sdp);

      peerRef.current.on("signal", (data) => {
        socket.emit("answer", { target: caller, sdp: data });
      });

      peerRef.current.on("stream", (remoteStream) => {
        partnerVideoRef.current.srcObject = remoteStream;
      });

      peerRef.current.on("ice-candidate", (candidate) => {
        socket.emit("ice-candidate", { target: caller, candidate });
      });

    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleReceiveAnswer = ({ sdp }) => {
    if (peerRef.current) {
      peerRef.current.signal(sdp);
    }
  };

  const handleNewICECandidate = (data) => {
    if (peerRef.current) {
      peerRef.current.signal(data.candidate);
    }
  };

  return (
    <div className="p-4">
      <h2>My ID: {myId}</h2>
      <input
        type="text"
        placeholder="Nhập ID đối tác"
        value={partnerId}
        onChange={(e) => setPartnerId(e.target.value)}
      />
      <button onClick={startCall} className="p-2 bg-blue-500 text-white rounded">
        Gọi
      </button>

      <div className="mt-4 flex gap-4">
        <video ref={myVideoRef} autoPlay muted className="w-1/2 border rounded" />
        <video ref={partnerVideoRef} autoPlay className="w-1/2 border rounded" />
      </div>
    </div>
  );
};

export default VideoCall;
