import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:3001"; // Thay đổi thành URL server của bạn
export const useSocket = (userId) => {
  const [socket, setSocket] = useState(null);
  const [isConnect, setIsConnect] = useState(false);
  useEffect(() => {
    if (!userId) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true, // ✅ Đảm bảo gửi cookie/token
      transports: ["websocket", "polling"], // ✅ Đảm bảo socket hoạt động ổn định
    });

    newSocket.on("connect", () => {
      console.log(userId,"Connected to socket:", newSocket.id); 
      newSocket.emit("authenticate", userId); // Gửi userId lên server
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return socket;
};
