import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bars3BottomRightIcon,
  Bars3Icon,
  ChevronDownIcon,
  Cog6ToothIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@mui/material";
import WaterBubbleButton from "./button/WaterBubbleButton";
import { BellIcon } from "@heroicons/react/24/outline";
const NotificationDropDow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
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

  const [menu, setMenu] = useState([
    {
      label: "Bảo mật",
      icon: LockClosedIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
    {
      label: "Cài đặt",
      icon: Cog6ToothIcon,
    },
  ]);
  return (
    <div
      className="relative w-full h-full flex justify-center"
      ref={containerRef}
    >
      {/* Nút Avatar */}
      <button onClick={() => setIsOpen(!isOpen)}>
        <div className="h-11 w-11 shadow-lg rounded-full border">
          <WaterBubbleButton>
            <BellIcon className="h-full w-full " />
          </WaterBubbleButton>
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
            className="absolute min-w-60  right-0 mt-14 z-10 divide-y bg-white rounded-lg shadow-lg shadow-zinc-500"
          >
            <button className="px-4  py-3 flex w-full flex-row justify-center items-center space-x-2 hover:scale-110 duration-700">
              <div className="text-sm max-w-64 ">Thông báo</div>
            </button>
            <ul className="py-2 text-base px-2 overflow-y-auto max-h-[80vh]">
              {/* {menu.map((e, index) => (
                <li key={index}>
                  <Button
                    href="#"
                    className="flex flex-row items-center px-4 py-2 h w-full rounded-md hover:scale-105 hover:bg-violet-100"
                    onClick={() => {
                      e?.event?.(); // Gọi hàm thay vì chỉ tham chiếu
                    }}
                  >
                    <div className="p-2 w-full flex items-center transition-all">
                      <e.icon className="h-8 w-8 p-1 bg-gray-50 rounded-full text-gray-800" />
                      <span className="pl-4">{e?.label}</span>
                    </div>
                  </Button>
                </li>
              ))} */}
              {menu.map((e, index) => (
                <li key={index} className="relative flex items-center w-full">
                  <Button
                    href="#"
                    className="flex px-4 py-2 w-full rounded-md items-center hover:scale-105 hover:bg-blue-200"
                  >
                    <ThemeToggle />
                  </Button>
                  <button
                    onClick={() => console.log("Icon clicked!")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-xl bg-none z-10"
                  >
                    <Bars3BottomRightIcon className="w-8 h-8 text-white hover:text-gray-700" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hộp thoại xác nhận đăng xuất */}
    </div>
  );
};
export default NotificationDropDow;
