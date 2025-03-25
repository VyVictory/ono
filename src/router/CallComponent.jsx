import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthProvider";
import { useSocketContext } from "../components/context/socketProvider";
import { Avatar } from "@mui/material";

const Call = () => {
  const { profile } = useAuth();
  const { partnerId } = useParams();
  const { socket } = useSocketContext();
  const userId = profile?.id;

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [callerId, setCallerId] = useState(null);
  let pendingCandidates = [];

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const userStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        localStreamRef.current = userStream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userStream;
        }
      } catch (err) {
        console.error("Lỗi lấy thiết bị media:", err);
      }
    };
    getMediaDevices();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("webrtcOffer", async ({ offer, senderId }) => {
      setIncomingCall(true);
      setCallerId(senderId);
      if (!peerRef.current) {
        peerRef.current = createPeer(false);
      }
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      
      if (pendingCandidates.length > 0) {
        pendingCandidates.forEach(async (candidate) => {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        });
        pendingCandidates = [];
      }
    });

    socket.on("webrtcCandidate", async ({ candidate }) => {
      if (peerRef.current && peerRef.current.remoteDescription) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        pendingCandidates.push(candidate);
      }
    });

    socket.on("webrtcAnswer", async ({ answer }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    return () => {
      socket.off("webrtcOffer");
      socket.off("webrtcAnswer");
      socket.off("webrtcCandidate");
    };
  }, [socket]);

  const createPeer = (isCaller) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => peer.addTrack(track, localStreamRef.current));
    }

    peer.onicecandidate = (e) => {
      if (e.candidate && socket) {
        socket.emit("webrtcCandidate", { candidate: e.candidate, receiverId: partnerId });
      }
    };
    peer.ontrack = (e) => {
      console.log("🎥 Nhận track:", e.streams);
      if (e.streams.length > 0) {
        remoteVideoRef.current.srcObject = e.streams[0];
      }
    };
    
    if (isCaller) {
      peer.createOffer().then((offer) => {
        peer.setLocalDescription(offer);
        socket.emit("webrtcOffer", { offer, receiverId: partnerId });
      });
    }

    return peer;
  };

  const startCall = () => {
    if (!callStarted) {
      setCallStarted(true);
      peerRef.current = createPeer(true);
    }
  };

  const acceptCall = async () => {
    setIncomingCall(false);
    setCallStarted(true);
    
    if (!peerRef.current) {
      peerRef.current = createPeer(false);
    }
    
    if (peerRef.current.remoteDescription) {
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socket.emit("webrtcAnswer", { answer, receiverId: callerId });
    } else {
      console.error("Remote description chưa được thiết lập trước khi tạo answer.");
    }
  };

  const endCall = () => {
    setCallStarted(false);
    setIncomingCall(false);
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
  };

  return (
    <div className="flex flex-col items-center">
      <video ref={localVideoRef} autoPlay playsInline className="w-1/2 mb-2 border border-gray-300" />
      <div className="relative w-1/2">
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full border border-gray-300" />
        {!callStarted && <Avatar />}
      </div>
      <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={startCall}>
        {callStarted ? "Kết thúc cuộc gọi" : "Bắt đầu gọi"}
      </button>
      {incomingCall && (
        <div className="mt-4 flex space-x-4">
          <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={acceptCall}>
            Nhận cuộc gọi
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded" onClick={endCall}>
            Từ chối
          </button>
        </div>
      )}
    </div>
  );
};

export default Call;
