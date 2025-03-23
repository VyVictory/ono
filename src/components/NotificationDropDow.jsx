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
import { Avatar, Button, Paper } from "@mui/material";
import WaterBubbleButton from "./button/WaterBubbleButton";
import { BellIcon } from "@heroicons/react/24/outline";
import Badge from "@mui/material/Badge";
import { useAuth } from "./context/AuthProvider";
import { getNotifications, readNotification } from "../service/notification";
import UserStatusIndicator from "./UserStatusIndicator"; 
import { useNavigate } from "react-router-dom";
const NotificationDropDow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isFetchNotifi = useRef(false);

  const { profile } = useAuth();
  const [notifications, setNotifications] = useState([]); // đây là mảng {unreadCount, notifications[]}
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
  useEffect(() => {
    const fetchNotifications = async () => {
      if (isFetchNotifi.current) return; // Kiểm tra isFetchNotifi bằng ref
      const notifications = await getNotifications({ start: 0, limit: 10 }); 
      setNotifications(notifications);
      isFetchNotifi.current = true; // Cập nhật ref để tránh fetch lại
    };
    if (profile) {
      fetchNotifications();
    }
  }, [profile]);
  const unreadMessagesCount = notifications?.unreadCount;
  const handleReadNotification = async (id, isRead) => {
    setTimeout(() => setIsOpen(false), 100);
    if (id && !isRead) {
      await readNotification({ id });
      // Cập nhật lại danh sách thông báo
      setNotifications((prevNotifications) => ({
        ...prevNotifications, // Giữ lại các trường khác như unreadCount
        unreadCount: Math.max(0, prevNotifications.unreadCount - 1), // Giảm 1, không xuống dưới 0
        notifications: prevNotifications.notifications.map((group) => ({
          ...group,
          notifications: group.notifications.map((noti) =>
            noti._id === id ? { ...noti, read: true } : noti
          ),
        })),
      }));
    } else {
      return;
    }
  };

  return (
    <div
      className="relative w-full h-full flex justify-center"
      ref={containerRef}
    >
      {/* Nút Avatar */}
      <button onClick={() => setIsOpen(!isOpen)}>
        <div className="h-10 w-10 shadow-lg rounded-full border">
          <Badge badgeContent={unreadMessagesCount} color="error">
            <WaterBubbleButton>
              <BellIcon className="h-full w-full text-yellow-600" />
            </WaterBubbleButton>
          </Badge>
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
            className="absolute min-w-72  -right-6 mt-14 z-50 divide-y rounded-lg"
          >
            <Paper elevation={3}>
              <button className="px-4  py-3  flex w-full flex-row justify-center items-center space-x-2 hover:scale-110 duration-700 border-b ">
                <div className="text-sm max-w-72 ">
                  <strong>Thông báo</strong>
                </div>
              </button>
              <ul className="py-1 text-base px-2 overflow-y-auto max-h-[80vh] pb-2 space-y-2">
                {!Array.isArray(notifications?.notifications) ||
                notifications?.notifications?.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Không có thông báo nào
                  </p>
                ) : (
                  notifications?.notifications?.map((group) => (
                    <div key={group?.date}>
                      {/* Tiêu đề ngày thông báo */}
                      {/* <h3 className="text-sm font-bold text-gray-600 px-4 py-2 text-center flex items-center">
                        <span className="flex-1 h-px bg-gray-300"></span>
                        <span className="px-3">
                          {new Date(group.date).toLocaleDateString()}
                        </span>
                        <span className="flex-1 h-px bg-gray-300"></span>
                      </h3> */}
                      {/* Danh sách thông báo trong ngày đó */}
                      {group.notifications.map((noti) => (
                        <li
                          key={noti._id}
                          onClick={() => {
                            handleReadNotification(noti?._id, noti?.read);
                          }}
                          className="relative flex items-center w-full pr-2"
                        >
                          {noti?.referenceModel == "Friendship" && (
                            <FriendShip data={noti} />
                          )}
                        </li>
                      ))}
                    </div>
                  ))
                )}
              </ul>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hộp thoại xác nhận đăng xuất */}
    </div>
  );
};
export default NotificationDropDow;
const FriendShip = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/profile/posts?id=${data?.sender?._id}`);
      }}
      className={`transition-opacity duration-300 ${
        data?.read ? "opacity-60" : "opacity-100"
      }`}
    >
      <Button
        href="#"
        className="flex px-4 py-2 w-full rounded-md items-center hover:scale-105 hover:bg-gray-200 gap-1"
      >
        <UserStatusIndicator
          userId={data?.sender?._id}
          userData={data?.sender}
        />
        <p
          className={`ml-2 text-xs line-clamp-2 max-w-[200px] ${
            data?.read && "text-gray-500"
          }`}
        >
          {data?.content}
        </p>
      </Button>
      <DetailTool />
    </div>
  );
};

const DetailTool = () => {
  return (
    <button
      onClick={() => console.log("Icon clicked!")}
      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-xl bg-none z-10"
    >
      <Bars3BottomRightIcon className="w-8 h-8 text-transparent  hover:text-gray-700" />
    </button>
  );
};
