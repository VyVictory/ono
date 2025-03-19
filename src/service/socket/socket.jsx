import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import connectENV from "../connectENV";
const SOCKET_URL = connectENV.socketUrl;
export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true, // ✅ Đảm bảo gửi cookie/token
      transports: ["websocket", "polling"], // ✅ Đảm bảo socket hoạt động ổn định
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
      sessionStorage.setItem("isConnect", "true"); // 🔹 Lưu vào sessionStorage
      newSocket.emit("authenticate", userId); // 🔹 Gửi userId lên server
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      sessionStorage.setItem("isConnect", "false"); // 🔹 Lưu vào sessionStorage
      // 🔹 Reset trạng thái khi unmount
    };
  }, [userId]);

  return socket;
};
