import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAuth } from "./AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@headlessui/react";
import UserStatusIndicator from "../UserStatusIndicator";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import io from "socket.io-client";
import connectENV from "../../service/connectENV";

const SocketContext = createContext();

const CustomToast = ({ message }) => {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => {
        navigate(`/messages/inbox?idUser=${message?.sender?._id}`);
      }}
    >
      <div className="w-full h-full flex flex-row">
        <UserStatusIndicator
          userId={message?.sender?._id}
          userData={message?.sender}
        />
        {/* Nội dung tin nhắn */}
        <div className="pl-2">
          <p className="font-semibold">
            {message?.sender?.firstName} {message?.sender?.lastName}
          </p>
          <p className="text-gray-500 text-start">{message?.content}</p>
        </div>
      </div>
    </Button>
  );
};

export const SocketProvider = ({ children }) => {
  const { profile } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!profile) return;
    const newSocket = io(connectENV.socketUrl || "ws://localhost:3001", {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ["websocket"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Connected to socket:", newSocket.id);
      setSocket(newSocket); // 🔹 Cập nhật socket ngay khi kết nối thành công
      newSocket.emit("authenticate", profile?._id);
    });

    newSocket.on("disconnect", (reason) => {
      console.error("❌ Socket disconnected", reason);
      setSocket(null); // 🚨 Cập nhật lại socket khi mất kết nối
    });

    return () => newSocket.disconnect();
  }, [profile]);

  const [newMessInbox, setNewMessInbox] = useState(null);
  const [newNotifi, setNewNotifi] = useState(null);
  const [recallMessId, setRecallMessId] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [loadProfile, setLoadProfile] = useState(null);
  const location = useLocation();
  const toastIdsRef = useRef([]);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newIdUser = searchParams.get("idUser");
    setIdUser(newIdUser);
  }, [location.search]);

  const showToast = (message) => {
    if (idUser === message?.sender?._id) {
      // console.log(
      //   "Đang ở trang hội thoại của user này, không hiển thị thông báo.",
      //   idUser
      // );
      return;
    }
    if (toastIdsRef.current.length >= 3) {
      const firstToastId = toastIdsRef.current.shift();
      toast.dismiss(firstToastId);
    }

    const newToastId = toast(<CustomToast message={message} />, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    toastIdsRef.current.push(newToastId);
  };
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data) => {
      showToast(data?.message);
      setNewMessInbox(data);
    };
    const handleRecallMessage = (data) => {
      setRecallMessId(data.messageId);
    };
    socket.on("newMessage", handleNewMessage);
    // socket.on("messagesDelivered", (data) => {
    //   console.log("Messages delivered:", data.messages);
    // });
    // socket.on("messagesSeen", (data) => {
    //   console.log("Messages seen:", data.messages);
    // });
    const handleNewNotifi = (data) => {
      setNewNotifi(data);
    };
    const handleLoadProfile = (data) => { 
      setLoadProfile(data);
    };
    socket.on("notification", handleNewNotifi);
    socket.on("loadProfile", handleLoadProfile);
    socket.on("messageRecalled", handleRecallMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageRecalled", handleRecallMessage);
      socket.on("loadProfile", handleLoadProfile);
      // socket.off("messagesDelivered");
      // socket.off("messagesSeen");
    };
  }, [socket, idUser]); // 🔹 Thêm idUser vào dependency để cập nhật đúng

  return (
    <SocketContext.Provider
      value={{
        newMessInbox,
        recallMessId,
        setRecallMessId,
        socket,
        newNotifi,
        loadProfile,
        setLoadProfile,
        setNewNotifi,
        userId: profile?._id,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Sử dụng đúng context
export const useSocketContext = () => useContext(SocketContext);
