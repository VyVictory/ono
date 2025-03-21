import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "../../service/socket/socket";
import socketConfig from "../../service/socket/socketConfig";
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { profile } = useAuth();
  const socket = useSocket(profile?._id);
  const [newMessInbox, setNFewMessInbox] = useState(null);
  useEffect(() => {
    if (!socketConfig) return;

    // Lắng nghe sự kiện nhận tin nhắn mới
    socketConfig.on("newMessage", (data) => {
      console.log("New message received:", data);
      setNFewMessInbox(data);
    });

    // Lắng nghe sự kiện tin nhắn được delivered
    socketConfig.on("messagesDelivered", (data) => {
      console.log("Messages delivered:", data.messages);
    });

    // Lắng nghe sự kiện tin nhắn được đọc
    socketConfig.on("messagesSeen", (data) => {
      console.log("Messages seen:", data.messages);
    });

    return () => {
      socketConfig.off("newMessage");
      socketConfig.off("messagesDelivered");
      socketConfig.off("messagesSeen");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ newMessInbox }}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Sử dụng đúng context
export const useSocketContext = () => useContext(SocketContext);
