import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import connectENV from "../connectENV";
import { useAuth } from "../../components/context/AuthProvider";
import socketConfig from "./socketConfig";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { profile } = useAuth();
  useEffect(() => {
    if (!profile?._id) return;
    if (socket) {
      return;
    }
    const newSocket = io(connectENV.socketUrl || "ws://localhost:3001/", {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    console.log(profile?._id);
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
  }, [profile]); // ✅ Chỉ chạy lại khi `userId` thay đổi

  return socket;
};
