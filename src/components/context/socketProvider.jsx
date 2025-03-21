import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { io } from "socket.io-client"; // ✅ Ensure io is imported
import { useSocket } from "../../service/socket/socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { profile } = useAuth();
  const [socket, setSocket] = useState(null);
  const [newMessInbox, setNewMessInbox] = useState(null); // ✅ Fixed typo

  useEffect(() => {
    if (!profile?._id) return;
    if (socket) return;
    console.log("ono");
    const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
      newSocket.emit("authenticate", profile._id);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      console.log("🛑 Cleaning up socket:", newSocket.id);
      newSocket.disconnect();
    };
  }, [profile]); // ✅ Runs when `profile` changes

  useEffect(() => {
    if (!socket) return;
    if (!profile?._id) {
      return;
    }
    console.log("Listening for socket events...");

    const handleNewMessage = (data) => {
      console.log("New message received:", data);
      setNewMessInbox(data);
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesDelivered", (data) =>
      console.log("Messages delivered:", data.messages)
    );
    socket.on("messagesSeen", (data) =>
      console.log("Messages seen:", data.messages)
    );

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesDelivered");
      socket.off("messagesSeen");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, newMessInbox }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
