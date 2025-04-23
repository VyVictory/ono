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
import { Avatar, Button, ButtonBase, Paper } from "@mui/material";
import WaterBubbleButton from "./button/WaterBubbleButton";
import { BellIcon } from "@heroicons/react/24/outline";
import Badge from "@mui/material/Badge";
import { useAuth } from "./context/AuthProvider";
import {
  getNotifications,
  getNotificationsFollow,
  readNotification,
} from "../service/notification";
import UserStatusIndicator from "./UserStatusIndicator";
import { useNavigate } from "react-router-dom";
import { UserPlusIcon, UserGroupIcon } from "@heroicons/react/24/solid";

import { useSocketContext } from "./context/socketProvider";

const NotificationDropDow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chane, setChane] = useState("Friend");
  const isFetchNotifi = useRef(false);
  const { newNotifi, setNewNotifi } = useSocketContext();
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
    if (newNotifi && profile) {
      setNotifications((prevNotifications) => ({
        ...prevNotifications,
        unreadCount: prevNotifications.unreadCount + 1,
        notifications: [
          {
            date: new Date().toISOString().split("T")[0], // Ngày hiện tại
            notifications: [
              newNotifi,
              ...(prevNotifications.notifications[0]?.notifications || []),
            ],
          },
          ...prevNotifications.notifications.slice(1),
        ],
      }));
    }
  }, [newNotifi, profile]);
  const fetchNotifications = async () => {
    if (isFetchNotifi.current) return; // Kiểm tra isFetchNotifi bằng ref
    const chaneFetch = async () => {
      return await getNotifications({ start: 0, limit: 10 });
      // switch (chane) {
      //   case "111":
      //     return await getNotificationsFollow({ start: 0, limit: 20 });

      //   default:
      //     return await getNotifications({ start: 0, limit: 20 });
      // }
    };

    const notifications = await chaneFetch();
    // console.log(notifications);
    setNotifications(notifications);
    isFetchNotifi.current = true; // Cập nhật ref để tránh fetch lại
  };
  // useEffect(() => {
  //   if (profile) {
  //     fetchNotifications();
  //   }
  // }, [chane]);
  useEffect(() => {
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
            noti._id === id ? { ...noti, isRead: true } : noti
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
              <button className="px-1  py-3 pb-1  flex w-full flex-col justify-center items-center space-x-2 border-b ">
                <div className="text-sm max-w-72  hover:scale-110 duration-700">
                  <strong>Thông báo</strong>
                </div>

                <div className="w-full flex flex-row flex-wrap gap-2">
                  {" "}
                  <div onClick={() => setChane("Friend")}>
                    <div className="w-full h-full p-2 flex items-center gap-2 rounded-md bg-green-50 shadow-sm hover:scale-105 hover:bg-green-200">
                      <UserGroupIcon className="w-5 h-5 text-green-500" />
                      <span>Friend</span>
                    </div>
                  </div>
                  <div onClick={() => setChane("Follow")}>
                    <div className="w-full h-full p-2 flex items-center gap-2 rounded-md bg-violet-50 shadow-sm hover:scale-105 hover:bg-violet-200">
                      <UserPlusIcon className="w-5 h-5 text-violet-500" />
                      <span>Follow</span>
                    </div>
                  </div>
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
                      {group.notifications.map((noti) => (
                        <li
                          key={noti._id}
                          onClick={() => {
                            handleReadNotification(noti?._id, noti?.isRead);
                          }}
                          className="relative flex items-center w-full pr-2"
                        >
                          {noti?.referenceModel == "Friendship" &&
                            chane == "Friend" && <FriendShip data={noti} />}
                          {noti?.referenceModel == "Follow" &&
                            chane == "Follow" && (
                              <>
                                <Follow data={noti} />
                              </>
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
        data?.isRead ? "opacity-60" : "opacity-100"
      }`}
    >
      <Button
        href="#"
        className="flex px-4 py-2 w-full rounded-md items-center hover:scale-105 hover:bg-gray-200 gap-1"
      >
        <UserStatusIndicator
          userId={data?.sender?._id}
          userData={data?.sender}
          styler={{
            button: { width: "40px", height: "40px" }, // ✅ Giới hạn kích thước
            avatar: { width: "40px", height: "40px" }, // ✅ Avatar không bị to quá
          }}
        />
        <p
          className={`ml-2 text-xs line-clamp-2 max-w-[200px] ${
            data?.isRead && "text-gray-500"
          }`}
        >
          {data?.content}
        </p>
      </Button>
      <DetailTool />
    </div>
  );
};
const Follow = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/profile/posts?id=${data?.sender?._id}`);
      }}
      className={`transition-opacity duration-300 ${
        data?.isRead ? "opacity-60" : "opacity-100"
      }`}
    >
      <div 
        className="flex px-4 py-2 w-full rounded-md items-center hover:scale-105 hover:bg-gray-200 gap-1"
      >
        <UserStatusIndicator
          userId={data?.sender?._id}
          userData={data?.sender}
          styler={{
            button: { width: "40px", height: "40px" }, // ✅ Giới hạn kích thước
            avatar: { width: "40px", height: "40px" }, // ✅ Avatar không bị to quá
          }}
        />
        <p
          className={`ml-2 text-xs line-clamp-2 max-w-[200px] ${
            data?.isRead && "text-gray-500"
          }`}
        >
          {data?.content}
        </p>
      </div>
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
