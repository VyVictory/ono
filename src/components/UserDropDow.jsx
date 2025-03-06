import { useState, useRef, useEffect } from "react";
import { useAuth } from "./context/AuthProvider";
import authToken from "../service/storage/authToken";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { useModule } from "./context/Module";
const UserDropDow = ({ avt }) => {
  const { setUsecase } = useModule();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const containerRef = useRef(null);
  const { profile } = useAuth();

  // Đóng dropdown khi click bên ngoài container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    authToken.deleteToken();
    window.location.reload(); // 🟢 Reload lại trang sau 500ms để đảm bảo UI cập nhật
    console.log("Đã đăng xuất!");
  };

  return (
    <div
      className="relative w-full h-full flex justify-center"
      ref={containerRef}
    >
      {/* Nút Avatar */}
      <button className="" onClick={() => setIsOpen(!isOpen)}>
        <div className="w-12 h-12 rounded-full relative">
          <img
            className="w-12 h-12 rounded-full border-2 border-blue-200 "
            src={avt}
            alt="user photo"
          />
          <ChevronDownIcon className="absolute bottom-0 right-0 h-4 w-4 p-[2px] rounded-full bg-gray-200 border border-white text-gray-900 " />
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute min-w-60 right-4 mt-14 z-10 divide-y bg-white rounded-lg shadow-lg shadow-zinc-500"
          >
            <a
              href="/profile"
              className="px-4  py-3 flex flex-row justify-center items-center space-x-2 hover:scale-110 duration-700"
            >
              <button className="w-10 h-10 border-2 border-blue-100 rounded-full flex justify-center items-center ">
                <img className="rounded-full" src={avt} alt="user photo" />
              </button>
              <div className="text-sm max-w-64 ">
                <div className="font-medium text-start">
                  {profile.firstName}
                  {profile.lastName}
                </div>
                <div className="truncate">{profile.email}</div>
              </div>
            </a>
            <ul className="py-2 text-base px-2 ">
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 rounded-md"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-row items-center px-4 py-2 h  rounded-md hover:scale-105 hover:bg-violet-100"
                  onClick={() => {
                    setUsecase("Privacy"), setIsOpen(false);
                  }}
                >
                  <Cog6ToothIcon className="h-8 w-8 p-1 bg-gray-50  rounded-full text-gray-800" />
                  <span className="pl-4">Settings</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex px-4 py-2   rounded-md flex-row items-center hover:scale-105 hover:bg-violet-100"
                >
                  {/* <MoonIcon className="h-6 w-6 text-gray-800" /> */}
                  <SunIcon className="h-8 w-8 p-1 bg-gray-50 rounded-full  text-yellow-500" />
                  <span className="pl-4">Nền Sáng</span>
                </a>
              </li>
            </ul>
            <div className="py-2 px-2 flex ">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full px-4 py-2 text-sm flex flex-row justify-center items-center hover:bg-red-50   rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  xmlSpace="preserve"
                  className="w-6 h-6 mr-2"
                >
                  <path
                    fill="#FFB0AA"
                    d="m31 256 122 100v-50h122V206H153v-50z"
                  />
                  <path
                    fill="#6E83B7"
                    d="M481 502H129V386h48v68h256V58H177v68h-48V10h352z"
                  />
                </svg>
                Đăng xuất
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hộp thoại xác nhận đăng xuất */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40">
            {/* Hiệu ứng cho hộp thoại */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center"
            >
              <p className="text-lg font-semibold text-gray-800">
                Bạn có muốn đăng xuất không?
              </p>
              <div className="mt-5 flex justify-center space-x-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg transition-all duration-200 hover:bg-gray-400 hover:text-gray-900"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg transition-all duration-200 hover:bg-red-600 shadow-md"
                >
                  Đăng xuất
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropDow;
