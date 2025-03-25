import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../components/context/AuthProvider";
import { useSocketContext } from "../components/context/socketProvider";
import { Avatar } from "@mui/material";
const CallComponent = () => {
  const { profile } = useAuth(); // Lấy thông tin user từ AuthProvider
  const { partnerId } = useParams();
  const { socket } = useSocketContext();

  const userId = profile?.id; // Lấy userId từ profile
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const [callStarted, setCallStarted] = useState(false);
  const [isRemoteVideoActive, setIsRemoteVideoActive] = useState(false);

  let pendingCandidates = [];
  useEffect(() => {
    if (!socket) {
      console.warn("⚠️ Socket chưa kết nối, chờ kết nối lại...");
      return;
    }
    if (!socket || !socket.id) {
      console.warn("⚠️ Socket chưa kết nối, chờ kết nối lại...");
      return;
    }

    console.log("✅ Connected to socket:", socket.id);
    console.log("📥 Lắng nghe Offer cho PartnerId:", partnerId);

    socket.on("webrtcOffer", async ({ offer, senderId }) => {
      console.log("📩 Nhận Offer từ:", senderId);
      if (!peerRef.current) {
        console.log("🎥 Tạo Peer mới...");
        peerRef.current = createPeer(false);
      }

      try {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(offer)
        );
        console.log("✅ Remote Description đã được đặt.");

        // Xử lý các ICE Candidate bị chờ
        pendingCandidates.forEach(async (candidate) => {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ Đã thêm ICE Candidate:", candidate);
        });
        pendingCandidates = []; // Xóa danh sách sau khi thêm xong

        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
        socket.emit("webrtcAnswer", { answer, receiverId: senderId });
        console.log("📤 Đã gửi Answer về cho", senderId);
      } catch (error) {
        console.error("❌ Lỗi khi đặt Remote Description:", error);
      }
    });

    socket.on("webrtcCandidate", async ({ candidate }) => {
      if (peerRef.current) {
        if (peerRef.current.remoteDescription) {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
          console.log("✅ Đã thêm ICE Candidate:", candidate);
        } else {
          console.warn(
            "⚠️ Chưa có Remote Description, lưu ICE Candidate vào hàng đợi."
          );
          pendingCandidates.push(candidate);
        }
      } else {
        console.warn("⚠️ peerRef chưa được tạo, không thể thêm ICE Candidate.");
      }
    });
    socket.on("webrtcAnswer", ({ answer, receiverId }) => {
      console.log(`📩 Nhận Answer từ ${receiverId}`, answer);
      if (peerRef.current) {
        peerRef.current
          .setRemoteDescription(new RTCSessionDescription(answer))
          .then(() => console.log("✅ Đã đặt Remote Description từ Answer."))
          .catch((error) => console.error("❌ Lỗi khi đặt Answer:", error));
      }
    });

    return () => {
      socket.off("webrtcOffer");
      socket.off("webrtcAnswer");
      socket.off("webrtcCandidate");
    };
  }, [socket]);
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  const createPeer = (isInitiator) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("📡 Gửi ICE Candidate:", event.candidate);
        socket.emit("webrtcCandidate", { candidate: event.candidate, receiverId: partnerId });
      } else {
        console.log("✅ Không còn ICE Candidate nào nữa.");
      }
    };
    

    peer.ontrack = (event) => {
      console.log("📹 Nhận track video:", event.streams[0]);
      console.log("🎞️ Số lượng track video:", event.streams[0].getVideoTracks().length);
    
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };
    
    if (isInitiator) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          stream.getTracks().forEach((track) => peer.addTrack(track, stream));
          peer.createOffer().then((offer) => {
            peer.setLocalDescription(offer);
            socket.emit("webrtcOffer", { offer, receiverId: partnerId });
          });
        })
        .catch((error) =>
          console.error("❌ Lỗi truy cập camera/micro:", error)
        );
    }

    return peer;
  };

  const startCall = () => {
    if (callStarted) return;
    if (!socket) {
      console.error("⚠️ Socket chưa kết nối, không thể bắt đầu cuộc gọi!");
      return;
    }
    setCallStarted(true);
    peerRef.current = createPeer(true);
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    setCallStarted(false);
  };
  setTimeout(() => {
    console.log("🎥 Remote Video Element:", remoteVideoRef.current);
    if (remoteVideoRef.current) {
      console.log("📺 Video srcObject:", remoteVideoRef.current.srcObject);
    }
  }, 3000);

  return (
    <div className="flex flex-col items-center">
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        className="w-1/2 mb-2 border border-gray-300"
      />
      <div className="relative w-1/2">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full border border-gray-300 ${
            isRemoteVideoActive ? "" : "hidden"
          }`}
        />
        {!isRemoteVideoActive && <Avatar />}
      </div>

      {!callStarted ? (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={startCall}
        >
          Bắt đầu gọi
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={endCall}
        >
          Kết thúc cuộc gọi
        </button>
      )}
    </div>
  );
};

export default CallComponent;
