import React, { useState, useRef, useEffect, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  NewspaperIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"; // Import icon
import { FriendIcon, GroupIcon, NewsIcon } from "../../css/icon";
import { motion, AnimatePresence } from "framer-motion";
const LeftMess = () => {
  const [searchText, setSearchText] = useState(false);
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
  return (
    <>
      {" "}

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
      <div className="bg-black overflow-y-auto h-full">
        danh sacsh
      </div>
    </>
  );
};

export default LeftMess;
