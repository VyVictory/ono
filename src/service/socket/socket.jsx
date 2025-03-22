import { useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthProvider";
import socketConfig from "./socketConfig";
import connectENV from "../connectENV";
import { io } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?._id || socket) return;
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
  }, [profile]);

  return socket;
};
