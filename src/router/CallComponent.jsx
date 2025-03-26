import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "../components/context/socketProvider";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthProvider";
export default function CallComponent() {
  const { profile } = useAuth();
  const { socket } = useSocketContext();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [isCalling, setIsCalling] = useState(false);
  const { partnerId } = useParams();
  useEffect(() => {
    if (!socket) return;

    const setupConnection = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        peerConnection.current = new RTCPeerConnection();

        stream
          .getTracks()
          .forEach((track) => peerConnection.current.addTrack(track, stream));

        peerConnection.current.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate;
            console.log("candidate",candidate)
            socket.emit("ice-candidate", { candidate, receiverId: partnerId });
          }
        };
        socket.on("offer", async (data) => {
          console.log("📥 Received offer:", data);
          if (!data || !data.offer) {
            console.error("❌ Received null or invalid offer:", data);
            return;
          }
          try {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(data.offer) // ✅ FIXED
            );
            const answer = await peerConnection.current.createAnswer();
            await peerConnection.current.setLocalDescription(answer);
            socket.emit("answer", { answer, senderId: partnerId });
          } catch (error) {
            console.error("Error handling offer:", error);
          }
        });
        
        
 

        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate;
            console.log("candidate",candidate)
            if (peerConnection.current.remoteDescription) {
              socket.emit("ice-candidate", {
                candidate,
                receiverId: partnerId,
              });
            } else {
              iceCandidateQueue.push(event.candidate);
            }
          }
        };

        socket.on("answer", async (data) => {
          console.log("📥 Received answer:", data);
          if (!data || !data.answer) {
            console.error("❌ Received null or invalid answer:", data);
            return;
          }
          try {
            await peerConnection.current.setRemoteDescription(
              new RTCSessionDescription(data.answer) // ✅ Fix: Access answer correctly
            );
        
            // Send queued ICE candidates after setting the remote description
            while (iceCandidateQueue.length > 0) {
              const candidate = iceCandidateQueue.shift();
              socket.emit("ice-candidate", {
                candidate,
                receiverId: partnerId,
              });
            }
          } catch (error) {
            console.error("Error handling answer:", error);
          }
        });
        
        

        const iceCandidateQueue = [];

        socket.on("ice-candidate", async (data) => {
          if (!peerConnection.current.remoteDescription) {
            console.warn("❌ Remote description not set yet, queuing ICE candidate:", data);
            iceCandidateQueue.push(data.candidate);
            return;
          }
          
          try {
            await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate));
            console.log("✅ Successfully added ICE Candidate:", data.candidate);
          } catch (error) {
            console.error("Error adding received ICE candidate:", error);
          }
        });
        
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    };

    setupConnection();

    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
        peerConnection.current = null;
      }
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, [socket]);

  const startCall = async () => {
    if (!peerConnection.current) return;
    setIsCalling(true);
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.emit("offer", { offer, receiverId: partnerId });
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        className="w-1/2 border"
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        className="w-1/2 border"
      />
      <button
        onClick={startCall}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={isCalling}
      >
        Start Call
      </button>
    </div>
  );
}
