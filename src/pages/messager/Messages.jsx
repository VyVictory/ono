import React, { useState, useRef, useEffect, useMemo, useId } from "react";
import {
  Bars3Icon,
  ExclamationCircleIcon,
  FlagIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import UseClickOutside from "../../components/UseClickOutside";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"; // Import icon

import { motion, AnimatePresence } from "framer-motion";
import Inbox from "./Inbox";
import { useNavigate } from "react-router-dom";

import UseMessageInfo from "./UseMessageInfo";
import InputMessage from "./InputMessage";
import { getCurrentUser } from "../../service/user";
import UserStatusIndicator from "../../components/UserStatusIndicator";
import { ButtonBase, Paper } from "@mui/material";
import LeftMess from "./LeftMess";
import {
  NotificationsActiveSharp,
  NotificationsNoneSharp,
  NotificationsOffSharp,
  Phone,
} from "@mui/icons-material";
import { useCall } from "../../components/context/CallProvider";
import { useAuth } from "../../components/context/AuthProvider";
import { getSetting, setSetting } from "../../service/storage/setting";
import { useModule } from "../../components/context/Module";
const Messages = () => {
  const { profile } = useAuth();
  const { setReport } = useModule();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { setCallId } = useCall();
  const [isRightbarOpen, setRightbarOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [startUser, setStartUser] = useState(null);
  const [isRightbarOpen1, setRightbarOpen1] = useState(true);
  const MessMenuLeft = useRef(null);
  const MessMenuRight = useRef(null);
  const { type, id } = UseMessageInfo();
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (newMessage) => {
    setMessages(newMessage); // ✅ Cập nhật tin nhắn mới, xoá danh sách cũ
  };

  UseClickOutside(MessMenuLeft, () => setSidebarOpen(false));
  UseClickOutside(MessMenuRight, () => setRightbarOpen(false));
  useEffect(() => {
    setProfileUser(null);
    const fetchProfile = async () => {
      if (type == "inbox") {
        try {
          const response = await getCurrentUser(id);
          setProfileUser(response.data); 
        } catch (error) {
          console.error("Get Profile Error:", error);
        }
      }
    };
    id && fetchProfile();
  }, [id]);

  const Centter = useMemo(() => {
    switch (type) {
      case "inbox":
        return <Inbox newmess={messages} />;
      default:
        return null;
    }
  }, [type, messages]); // ✅ Cập nhật khi messages thay đổi
  {
    type && profileUser?._id ? Centter : <p>Đang tải...</p>;
  }
  return (
    <div className="flex flex-row">
      {/* Sidebar className={sidebarClass} */}
      <motion.div
        ref={MessMenuLeft}
        initial={false}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`NavbarUser
    fixed left-0 top-0 h-[100dvh] w-[360px] shadow-lg shadow-gray-300 border-x-gray-300 bg-white z-30 transition-transform duration-300 ease-in-out 
    ${isSidebarOpen ? "translate-x-0" : "translate-x-[-100%]"}
    lg:w-[350px] lg:relative lg:block lg:translate-x-0`}
        style={{ maxWidth: "100%" }}
      >
        {/* Nội dung bên trong */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }} // Ban đầu ẩn nội dung
            animate={{ opacity: 1 }} // Hiện dần nội dung sau khi mở sidebar
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col h-full w-full" // Đảm bảo chiều cao đầy đủ
          >
            <div className="p-2 flex justify-between items-center relative">
              <h2 className="text-2xl font-semibold w-full absolute text-center truncate whitespace-nowrap">
                Đoạn chat
              </h2>
              <div className="w-full justify-end flex relative z-10 h-8">
                <ArrowLeftIcon
                  onClick={() => {
                    setSidebarOpen((prevState) => !prevState);
                  }}
                  className="h-8 lg:hidden hover:scale-125 text-blue-500 bg-violet-200 active:bg-violet-400 hover:bg-violet-300 rounded-3xl p-1 cursor-pointer"
                />
              </div>
            </div>
            <LeftMess
              setStartUser={setStartUser}
              onClose={() => setSidebarOpen((prevState) => !prevState)}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Z-INDEX Chat Section */}

      <main
        className="w-full flex h-[100dvh] flex-col justify-end"
        // style={{ minHeight: `${screenHeight - 1}px` }}
      >
        {/* top nav */}
        <div className="NavbarUser"></div>
        <header className="shadow-sm border-b px-3 z-10  flex items-center bg-white  ">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen((prevState) => !prevState)}
          >
            <Bars3Icon className="h-6 w-6 " />
          </button>

          <div className="flex flex-row min-h-16 justify-start items-center py-1 w-full space-x-3 max-h-32 pl-3">
            {profileUser && (
              <>
                <UserStatusIndicator
                  userId={profileUser?._id}
                  userData={profileUser}
                  styler={{
                    button: { width: "40px", height: "40px" }, // ✅ Giới hạn kích thước
                    avatar: { width: "40px", height: "40px" }, // ✅ Avatar không bị to quá
                  }}
                />
                <div>
                  {" "}
                  {profileUser?.role == 1 && (
                    <strong className="text-red-500">Admin</strong>
                  )}
                  <h2 className="text-lg font-semibold text-gray-600">
                    {`${profileUser?.firstName
                      .charAt(0)
                      .toUpperCase()}${profileUser.firstName.slice(1)} 
          ${profileUser?.lastName
            .charAt(0)
            .toUpperCase()}${profileUser.lastName.slice(1)}`}
                  </h2>
                </div>
              </>
            )}
          </div>
          {(profile?.role == 1 || profileUser?.friendStatus == "accepted") && (
            <a
              onClick={() => {
                setCallId(profileUser._id);
              }}
            >
              <Phone className="w-12 cursor-pointer h-12 hover:scale-125 text-blue-400" />
            </a>
          )}
          {/* lớn thì hiện */}
          <div className="flex items-center justify-center pl-2">
            <button className="xl:hidden">
              <ExclamationCircleIcon
                onClick={() => {
                  setRightbarOpen1(true);
                  if (!isRightbarOpen1) {
                    setTimeout(() => {
                      setRightbarOpen((prevState) => !prevState);
                    }, 1);
                  } else {
                    setRightbarOpen((prevState) => !prevState);
                  }
                }}
                className="h-8 w-8 p-1 hover:bg-gray-200 hover:text-blue-700 rounded-full text-blue-500"
              />
            </button>
          </div>
          {/* nhỏ thì hiện */}
          <div className="flex items-center justify-center">
            {!isRightbarOpen && (
              <button className="xl:block hidden">
                <ExclamationCircleIcon
                  onClick={() => setRightbarOpen1(!isRightbarOpen1)}
                  className="h-8 w-8 p-1 hover:bg-gray-200 hover:text-blue-700 rounded-full text-blue-500"
                />
              </button>
            )}
          </div>
        </header>

        {/* center */}
        <div className="flex-1 overflow-auto flex items-center justify-center">
          {Centter}
        </div>
        {/* Chat input */}
        <Paper>
          <InputMessage newmess={handleNewMessage} />
        </Paper>
      </main>
      {/*  */}
      <div className="">
        <div
          ref={MessMenuRight}
          className={`NavbarUser
         fixed  right-0 top-0  h-full w-[360px] border-l shadow-lg shadow-gray-300 bg-white z-30
         transition-transform duration-300  ease-in-out
         ${isRightbarOpen ? "translate-x-0 " : "translate-x-[100%]"}
         ${
           isRightbarOpen1
             ? "xl:relative xl:translate-x-0 xl:duration-0"
             : "xl:duration-0"
         } 
       `}
          style={{ maxWidth: "100%" }}
        >
          <div className="p-2 flex justify-between items-center">
            <div className="flex z-10 h-8 absolute">
              <ArrowRightIcon
                onClick={() => setRightbarOpen((prevState) => !prevState)}
                className="h-8 xl:hidden hover:scale-125 text-blue-500 bg-violet-200 active:bg-violet-400 hover:bg-violet-300 rounded-3xl p-1 cursor-pointer"
              />
            </div>
            <div className="flex flex-col w-full justify-center">
              <h2 className="w-full text-center text-2xl font-semibold pb-2 border-b">
                Thông tin
              </h2>
              <div className="flex flex-col w-full items-center p-2">
                {profileUser && (
                  <>
                    <div className="w-16 h-16 rounded-full border-2 border-blue-400">
                      <UserStatusIndicator
                        userId={profileUser?._id}
                        userData={profileUser}
                      />
                    </div>
                    <div>
                      {" "}
                      {profileUser?.role == 1 && (
                        <strong className="text-red-500">Admin</strong>
                      )}
                      <h2 className="text-lg font-semibold text-gray-600">
                        {`${profileUser?.firstName
                          .charAt(0)
                          .toUpperCase()}${profileUser.firstName.slice(1)} 
          ${profileUser?.lastName
            .charAt(0)
            .toUpperCase()}${profileUser.lastName.slice(1)}`}
                      </h2>
                    </div>
                  </>
                )}
              </div>
              <div className="w-full flex justify-center gap-3">
                {" "}
                <NotificationUser userId={profileUser?._id} />
                <div
                  onClick={() => {
                    if (profileUser?._id) {
                      setReport({ userId: profileUser?._id });
                    }
                  }}
                  className="hover:scale-110 cursor-pointer flex items-center flex-col"
                >
                  <FlagIcon className="text-red-500 w-6 h-6" />
                  <p className="text-xs text-gray-500">Tố cáo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rightbar */}
    </div>
  );
};

export default Messages;

const NotificationUser = ({ userId }) => {
  const [isNotification, setIsNotification] = useState(false);

  useEffect(() => {
    if (userId) {
      const saved = getSetting({ name: "inbox", userId });
      if (saved !== null) {
        setIsNotification(saved === "true"); // cookie luôn là string
      }
    }
  }, [userId]);

  const toggleNotification = () => {
    const newValue = !isNotification;
    setIsNotification(newValue);
    setSetting({
      name: "inbox",
      userId,
      value: String(newValue), // lưu dưới dạng chuỗi
    });
  };

  return (
    <div
      onClick={toggleNotification}
      className="cursor-pointer flex flex-col items-center hover:scale-125 uppercase"
    >
      {isNotification ? (
        <>
          {" "}
          <NotificationsActiveSharp className="text-blue-500" />
          <p className="text-xs text-gray-500">Tắt</p>
        </>
      ) : (
        <>
          {" "}
          <NotificationsOffSharp className="text-blue-500" />
          <p className="text-xs text-gray-500">Bật</p>
        </>
      )}
    </div>
  );
};
