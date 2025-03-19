import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Bars3Icon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import UseClickOutside from "../../components/UseClickOutside";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"; // Import icon
import { FriendIcon, GroupIcon, NewsIcon } from "../../css/icon";
import { motion, AnimatePresence } from "framer-motion";
import Inbox from "./Inbox";
import { useNavigate } from "react-router-dom";

import UseMessageInfo from "./UseMessageInfo";
import InputMessage from "./InputMessage";
import { getCurrentUser } from "../../service/user";
import avt from "../../img/DefaultAvatar.jpg";
import LoadingAnimation from "../../components/LoadingAnimation";

const Messages = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRightbarOpen, setRightbarOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [isRightbarOpen1, setRightbarOpen1] = useState(true);
  const navigate = useNavigate();
  const MessMenuLeft = useRef(null);
  const MessMenuRight = useRef(null);
  const { type, id } = UseMessageInfo();
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (newMessage) => {
    setMessages(newMessage); // ✅ Cập nhật tin nhắn mới, xoá danh sách cũ
  };

  // console.log("Loại tin nhắn:", type);
  // console.log("ID:", id);
  const HandleLinkToMess = (chane, id) => {
    let chaneInbox = null;
    switch (chane) {
      case "group":
        chaneInbox = "group?idGroup";
        break;
      case "inbox":
        chaneInbox = "inbox?idUser";
        break;
      default:
        break;
    }
    navigate(`/messages/${chaneInbox}=${id}`);
  };

  UseClickOutside(MessMenuLeft, () => setSidebarOpen(false));
  UseClickOutside(MessMenuRight, () => setRightbarOpen(false));
  useEffect(() => {
    const fetchProfile = async () => {
      if (type == "inbox") {
        try {
          const response = await getCurrentUser(id);
          setProfileUser(response);
          // console.log(response);
        } catch (error) {
          console.error("Get Profile Error:", error);
        }
      }
    };
    id && fetchProfile();
  }, [id]);
  const [searchText, setSearchText] = useState(false);
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
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => setScreenHeight(window.innerHeight);
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="flex ">
      {/* Sidebar className={sidebarClass} */}
      <motion.div
        ref={MessMenuLeft}
        initial={false} // Không cần animate bằng Framer Motion nữa
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={` NavbarUser
    fixed left-0 top-0 h-screen w-[360px] shadow-lg shadow-gray-300  border-x-gray-300 bg-white z-30  transition-transform duration-300 ease-in-out   ${
      isSidebarOpen ? "translate-x-0" : "translate-x-[-100%]"
    }   lg:w-[350px] lg:relative lg:block lg:translate-x-0  `}
      >
        {/* Nội dung bên trong */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }} // Ban đầu ẩn nội dung
            animate={{ opacity: 1 }} // Hiện dần nội dung sau khi mở sidebar
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="p-2 flex justify-between items-center relative">
              <h2 className="text-2xl font-semibold w-full absolute text-center truncate whitespace-nowrap">
                Đoạn chat
              </h2>
              <div className="w-full justify-end flex relative z-10 h-8">
                <ArrowLeftIcon
                  onClick={() => {
                    setSidebarOpen((prevState) => !prevState);
                    setSearchText("");
                  }}
                  className="h-8 lg:hidden hover:scale-125 text-blue-500 bg-violet-200 active:bg-violet-400 hover:bg-violet-300 rounded-3xl p-1 cursor-pointer"
                />
              </div>
            </div>

            {/* Ô tìm kiếm */}
            <div className="flex items-center max-h-12 justify-center px-4 space-x-2 w-full rounded-lg pb-1">
              <AnimatePresence>
                {searchText && (
                  <motion.button
                    onClick={() => setSearchText(false)}
                    initial={{ opacity: 0, x: -20 }} // Bắt đầu mờ và lệch trái
                    animate={{ opacity: 1, x: 0 }} // Trượt vào
                    exit={{ opacity: 0, x: -20 }} // Trượt ra khi ẩn
                    transition={{ duration: 0.02, ease: "easeOut" }}
                    className="h-10 w-10 px-2 flex items-center justify-center hover:bg-violet-100 rounded-full transition duration-200 ease-in-out"
                  >
                    <ArrowLeftIcon className="h-6 w-6 hover:scale-125 text-blue-500" />
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.div
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center w-full max-w-lg bg-violet-100 rounded-3xl shadow-sm pl-2 transition duration-300 ease-in-out"
              >
                <button
                  onClick={() => setSearchText(false)}
                  className="h-10 w-10 hover:scale-125 justify-center text-violet-300 hover:text-violet-700 rounded-full transition duration-300 ease-in-out"
                >
                  <MagnifyingGlassIcon className="max-h-6" />
                </button>
                <input
                  type="text"
                  placeholder="Tìm kiếm trên O no"
                  onClick={() => setSearchText(true)}
                  className="w-full h-10 pr-2 pl-1 text-gray-700 bg-transparent outline-none rounded-full focus:ring-0"
                />
              </motion.div>
            </div>

            {/* Menu */}
            <div className="p-2 flex space-x-2 bg-white shadow-sm rounded-lg overflow-x-auto pb-3 mx-1">
              <button
                onClick={() =>
                  HandleLinkToMess("inbox", "67d7da499ef20e261a3911f6")
                }
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 rounded-3xl px-4 py-2 shadow-sm hover:bg-violet-100 hover:scale-105 active:bg-violet-200 active:scale-105 transition-all duration-300 ease-in-out"
              >
                <FriendIcon />
                <span className="text-sm font-medium text-nowrap">Bạn bè</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 rounded-3xl px-4 shadow-sm hover:bg-blue-100 hover:scale-105 active:bg-blue-200 active:scale-105 transition-all duration-300 ease-in-out">
                <GroupIcon />
                <span className="text-sm font-medium">Nhóm</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 rounded-3xl px-4 shadow-sm hover:bg-orange-100 hover:scale-105 active:bg-orange-200 active:scale-105 transition-all duration-300 ease-in-out">
                <NewsIcon />
                <span className="text-sm font-medium">Tin</span>
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Z-INDEX Chat Section */}

      <div className="w-full NavbarUser flex flew-grow flex-col justify-end"  style={{ height: screenHeight }}>
        {/* top nav */}

        <div className="shadow-sm border-b px-3 z-10  flex items-center bg-white  ">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen((prevState) => !prevState)}
          >
            <Bars3Icon className="h-6 w-6 " />
          </button>

          <div className="flex flex-row min-h-16 justify-start items-center py-1 w-full space-x-1 max-h-32">
            {profileUser && (
              <>
                <button className="max-h-12 aspect-square border-4 border-white rounded-full ">
                  <img
                    className="w-full rounded-full"
                    src={avt}
                    alt="Profile"
                    loading="lazy"
                  />
                </button>
                <h2 className="text-lg font-semibold">
                  {profileUser?.firstName + " " + profileUser?.lastName}
                </h2>
                <p className="">Trạng thái</p>
              </>
            )}
          </div>

          {/* lớn thì hiện */}
          <div className="flex items-center justify-center">
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
        </div>

        {/* center */}
        <div className="flex-grow overflow-y-auto">{Centter}</div>
        {/* Chat input */}
        <div className="shadow-sm border-t flex items-center p-2 bg-white">
          <InputMessage newmess={handleNewMessage} />
        </div>
      </div>
      {/* right */}
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
        >
          <div className="p-2 flex justify-between items-center">
            <div className="flex z-10 h-8 absolute">
              <ArrowRightIcon
                onClick={() => setRightbarOpen((prevState) => !prevState)}
                className="h-8 xl:hidden hover:scale-125 text-blue-500 bg-violet-200 active:bg-violet-400 hover:bg-violet-300 rounded-3xl p-1 cursor-pointer"
              />
            </div>
            <h2 className="w-full text-center text-2xl font-semibold">
              Thông tin
            </h2>
          </div>
        </div>
      </div>

      {/* Rightbar */}
    </div>
  );
};

export default Messages;
