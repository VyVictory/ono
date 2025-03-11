import React, { useState, useRef, useEffect } from "react";
import {
  Bars3Icon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import UseClickOutside from "../../components/UseClickOutside";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline"; // Import icon
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline"; // Import icon
import { FriendIcon, GroupIcon, NewsIcon } from "../../css/icon";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessages from "./ChatMessages";
const Messages = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isRightbarOpen, setRightbarOpen] = useState(false);
  const [isRightbarOpen1, setRightbarOpen1] = useState(true);
  const MessMenuLeft = useRef(null);
  const MessMenuRight = useRef(null);

  const divs = [];
  for (let i = 0; i < 30; i++) {
    divs.push(
      <React.Fragment key={i}>
        <div className="flex space-x-4 justify-end">
          <div className="bg-gray-200 p-2 rounded-md max-w-xs">
            Đơn hàng #12345, tôi không thấy được trạng thái giao hàng.
          </div>
        </div>
        <div className="flex space-x-4">
          <div className="bg-blue-500 text-white p-2 rounded-md max-w-xs">
            Để tôi kiểm tra giúp bạn nhé!
          </div>
        </div>
      </React.Fragment>
    );
  }

  const [message, setMessage] = useState(" ");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setMessage(newValue);

    // Automatically adjust the textarea height
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height to auto to shrink on content deletion
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content

    // Ensure textarea doesn't grow beyond 3 lines
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const maxHeight = lineHeight * 3;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto"; // Show scrollbar when exceeding 3 lines
    } else {
      textarea.style.overflowY = "hidden"; // Hide scrollbar if within 3 lines
    }
  };

  // Use the custom hook to close sidebar and rightbar when clicked outside
  UseClickOutside(MessMenuLeft, () => setSidebarOpen(false));
  UseClickOutside(MessMenuRight, () => setRightbarOpen(false));

  const [searchText, setSearchText] = useState(false);
  return (
    <div className="flex h-screen ">
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
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 rounded-3xl px-4 py-2 shadow-sm hover:bg-violet-100 hover:scale-105 active:bg-violet-200 active:scale-105 transition-all duration-300 ease-in-out">
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
      <div className="w-full h-screen NavbarUser flex flew-grow flex-col">
        {/* top nav */}
        <div className="shadow-sm border-b px-3 z-10  flex items-center bg-white  ">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen((prevState) => !prevState)}
          >
            <Bars3Icon className="h-6 w-6 " />
          </button>
          <div className="flex flex-row justify-center items-center p-4 w-full">
            <h2 className="text-lg font-semibold">Tên người dùng</h2>
            <p className="">Trạng thái</p>
          </div>
          {/* lớn thì hiện */}
          <div className="flex items-center justify-center">
            <button className="lg:hidden">
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
              <button className="lg:block hidden">
                <ExclamationCircleIcon
                  onClick={() => setRightbarOpen1(!isRightbarOpen1)}
                  className="h-8 w-8 p-1 hover:bg-gray-200 hover:text-blue-700 rounded-full text-blue-500"
                />
              </button>
            )}
          </div>
        </div>
        {/* center */}
        <div className="flex-grow overflow-y-auto">
          <div className="flex flex-col space-y-4 p-4 h-full">
            {divs}
            <ChatMessages
              messages={["Xin chào!", "Bạn khỏe không?", "Hôm nay bạn làm gì?"]}
            />
          </div>
        </div>
        {/* Chat input */}
        <div className="shadow-sm border-t flex items-center p-2 bg-white">
          <div className="flex items-center flex-row space-x-1 pr-2">
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-10"
              >
                <defs>
                  <linearGradient
                    id="grad1"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop
                      offset="0%"
                      style={{ stopColor: "#6ee7b7", stopOpacity: 1 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                    />
                  </linearGradient>
                </defs>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  fill="url(#grad1)"
                  stroke="#ffffff" // White border for a sticker effect
                  strokeWidth="2" // Slightly thicker border
                  filter="drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.15))" // Drop shadow for a lifted look
                />
              </svg>
            </button>

            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-8"
              >
                <defs>
                  <style>{".b{fill:#864e20}"}</style>
                </defs>
                <rect
                  x="1"
                  y="1"
                  width="22"
                  height="22"
                  rx="7.656"
                  style={{ fill: "#f8de40" }}
                />
                <path
                  className="b"
                  d="M14 11.207a.32.32 0 0 0-.313.327 2.1 2.1 0 0 1-.5 1.33A1.593 1.593 0 0 1 12 13.3a1.6 1.6 0 0 1-1.187-.43 2.088 2.088 0 0 1-.5-1.334.32.32 0 1 0-.64-.012 2.712 2.712 0 0 0 .679 1.791 2.211 2.211 0 0 0 1.648.623 2.211 2.211 0 0 0 1.647-.626 2.718 2.718 0 0 0 .679-1.791.322.322 0 0 0-.326-.314z"
                />
                <path
                  d="M23 13.938a14.69 14.69 0 0 1-12.406 6.531c-5.542 0-6.563-1-9.142-2.529A7.66 7.66 0 0 0 8.656 23h6.688A7.656 7.656 0 0 0 23 15.344z"
                  style={{ fill: "#e7c930" }}
                />
                <path
                  className="b"
                  d="M9.6 8.833 9.021 8.6a22.797 22.797 0 0 0-2.138-.774 18.44 18.44 0 0 0-1.1-.3h-.012a.246.246 0 0 0-.186.448l.01.006c.325.2.656.392.991.573q.281.15.564.291a.245.245 0 0 1 0 .439q-.285.141-.564.292c-.335.18-.667.369-.992.573l-.016.01a.246.246 0 0 0 .187.447h.018c.374-.088.741-.19 1.105-.3s.723-.234 1.079-.362c.179-.064.355-.134.532-.2l.526-.213.573-.232a.246.246 0 0 0 .002-.465zM18.81 9.844a.182.182 0 0 1-.331.1 2.026 2.026 0 0 0-.568-.567 1.732 1.732 0 0 0-1.916 0 2.016 2.016 0 0 0-.571.569.182.182 0 0 1-.331-.1 1.632 1.632 0 0 1 .346-1.023 1.927 1.927 0 0 1 3.026 0 1.64 1.64 0 0 1 .345 1.021z"
                />
              </svg>
            </button>
          </div>
          <div className="flex-grow space-x-1 flex items-center h-full ">
            <div className=" w-full h-full flex items-center">
              <div className="w-full h-full border border-gray-300 px-2 rounded-2xl shadow-inner shadow-slate-300 pt-1">
                <textarea
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={handleChange}
                  className=" text-gray-700 pt-1 text-sm w-full h-full shadow-inner focus:outline-none focus:ring-0 focus:ring-none 
                  resize-none focus:ring-none "
                  rows="1"
                  style={{ overflowY: "hidden" }}
                />
              </div>
            </div>
            <button className="group relative">
              <PaperAirplaneIcon
                title="Gửi tin nhắn"
                className="h-10 w-10 p-1 rounded-full text-blue-400 hover:scale-110 hover:shadow-sm hover:shadow-blue-400/50 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 active:scale-95 active:transition-all"
              />
              <span className="absolute z-30 right-0 bottom-full w-max p-2 bg-gray-500 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Gửi tin nhắn
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Rightbar */}
      <div className="NavbarUser">
        <div
          ref={MessMenuRight}
          className={`
      fixed  right-0 top-0 lg:pt-0 h-full w-[360px] border-l shadow-lg shadow-gray-300 bg-white z-30
      transition-transform duration-300  ease-in-out
      ${isRightbarOpen ? "translate-x-0 " : "translate-x-[100%]"}
      ${
        isRightbarOpen1
          ? "lg:relative lg:translate-x-0 lg:duration-0"
          : "lg:duration-0"
      } 
    `}
        >
          <div className="p-2 flex justify-between items-center">
            <div className="flex z-10 h-8 absolute">
              <ArrowRightIcon
                onClick={() => setRightbarOpen((prevState) => !prevState)}
                className="h-8 lg:hidden hover:scale-125 text-blue-500 bg-violet-200 active:bg-violet-400 hover:bg-violet-300 rounded-3xl p-1 cursor-pointer"
              />
            </div>
            <h2 className="w-full text-center text-2xl font-semibold">
              Thông tin
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
