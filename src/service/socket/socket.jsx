import { useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthProvider";
import connectENV from "../connectENV";
import { io } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?._id ||socket) return;
    
    // Nếu socket đã tồn tại và đang kết nối, không tạo lại
    if (socket && socket.connected) {
      console.log("⚡ Socket is already connected:", socket.id);
      return;
    }

    const newSocket = io(connectENV.socketUrl || "ws://localhost:3001", {
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
      newSocket.emit("authenticate", profile?._id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      console.log("🛑 Cleaning up socket:", newSocket?.id);
      newSocket?.disconnect();
    };
  }, [profile?._id]); // 🔹 Chỉ theo dõi _id để tránh render lại không cần thiết

  return socket;
};
