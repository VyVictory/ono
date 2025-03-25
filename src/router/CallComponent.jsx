import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthProvider";
import { useSocketContext } from "../components/context/socketProvider";
import { Avatar } from "@mui/material";

const CallComponent = () => {
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
    if (!socket) return;

    socket.on("webrtcOffer", async ({ offer, senderId }) => {
      setIncomingCall(true);
      setCallerId(senderId);
      peerRef.current = createPeer(false);
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      pendingCandidates.forEach(async (candidate) => {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });
      pendingCandidates = [];
    });

    socket.on("webrtcCandidate", async ({ candidate }) => {
      if (peerRef.current?.remoteDescription) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        pendingCandidates.push(candidate);
      }
    });

    socket.on("webrtcAnswer", async ({ answer }) => {
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      pendingCandidates.forEach(async (candidate) => {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      });
      pendingCandidates = [];
    });

    return () => {
      socket.off("webrtcOffer");
      socket.off("webrtcAnswer");
      socket.off("webrtcCandidate");
    };
  }, [socket]);

  useEffect(() => () => endCall(), []);

  const createPeer = (isInitiator) => {
    const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("webrtcCandidate", { candidate: event.candidate, receiverId: partnerId });
      }
    };
   
    peer.ontrack = (event) => (remoteVideoRef.current.srcObject = event.streams[0] , console.log(event.streams[0]));
    
    if (isInitiator) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        localStreamRef.current = stream;
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
        peer.createOffer().then((offer) => {
          peer.setLocalDescription(offer);
          socket.emit("webrtcOffer", { offer, receiverId: partnerId });
        });
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
    const answer = await peerRef.current.createAnswer();
    await peerRef.current.setLocalDescription(answer);
    socket.emit("webrtcAnswer", { answer, receiverId: callerId });
  };

  const endCall = () => {
    peerRef.current?.close();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;
    localVideoRef.current.srcObject = remoteVideoRef.current.srcObject = null;
    setCallStarted(false);
    setIncomingCall(false);
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

export default CallComponent;