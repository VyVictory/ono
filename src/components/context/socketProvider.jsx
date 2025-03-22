import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "../../service/socket/socket";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/toastStyles.css";
import { Button } from "@headlessui/react";
import UserStatusIndicator from "../UserStatusIndicator";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

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
  const socket = useSocket();
  const [newMessInbox, setNewMessInbox] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const location = useLocation();
  const toastIdsRef = useRef([]);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newIdUser = searchParams.get("idUser");
    setIdUser(newIdUser);
  }, [location.search]);

  const showToast = (message) => {
    if (idUser === message?.sender?._id) {
      console.log(
        "Đang ở trang hội thoại của user này, không hiển thị thông báo.",
        idUser
      );
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

    socket.on("newMessage", handleNewMessage);
    // socket.on("messagesDelivered", (data) => {
    //   console.log("Messages delivered:", data.messages);
    // });
    // socket.on("messagesSeen", (data) => {
    //   console.log("Messages seen:", data.messages);
    // });

    return () => {
      socket.off("newMessage", handleNewMessage);
      // socket.off("messagesDelivered");
      // socket.off("messagesSeen");
    };
  }, [socket, idUser]); // 🔹 Thêm idUser vào dependency để cập nhật đúng

  return (
    <SocketContext.Provider value={{ newMessInbox }}>
      {children}
    </SocketContext.Provider>
  );
};

// ✅ Sử dụng đúng context
export const useSocketContext = () => useContext(SocketContext);
