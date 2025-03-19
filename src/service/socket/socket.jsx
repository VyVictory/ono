import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import connectENV from "../connectENV";

const SOCKET_URL = connectENV.socketUrl;

export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null); // 🔹 Dùng ref để giữ socket

  useEffect(() => {
    if (!userId) return;

    if (socketRef.current) {
      socketRef.current.disconnect(); // 🔹 Đảm bảo không tạo nhiều socket
    }

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
    socketRef.current = newSocket; // 🔹 Lưu socket vào ref

    return () => {
      newSocket.disconnect();
      sessionStorage.setItem("isConnect", "false");
    };
  }, [userId]); // 🔹 Khi `userId` thay đổi, tạo lại socket

  return socket;
};
