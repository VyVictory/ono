import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001"; // Thay đổi thành URL server của bạn
export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const isConnectRef = useRef(sessionStorage.getItem("isConnect") === "true");
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true, // ✅ Đảm bảo gửi cookie/token
      transports: ["websocket", "polling"], // ✅ Đảm bảo socket hoạt động ổn định
    });

    newSocket.on("connect", () => {
      console.log("Connected to socket:", newSocket.id);
      isConnectRef.current = true;
      sessionStorage.setItem("isConnect", "true"); // 🔹 Lưu vào sessionStorage
      newSocket.emit("authenticate", userId); // 🔹 Gửi userId lên server
    });
    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket");
      isConnectRef.current = false;
      sessionStorage.setItem("isConnect", "false"); // 🔹 Cập nhật sessionStorage khi ngắt kết nối
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      isConnectRef.current = false;
      sessionStorage.setItem("isConnect", "false"); // 🔹 Reset trạng thái khi unmount
    };
  }, [userId]);

  return socket;
};
