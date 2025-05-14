import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import FlagIcon from "@mui/icons-material/Flag"; // icon báo cáo
import CustomizedMenus from "./CustomizedMenus";
import { useModule } from "../../components/context/Module";
import { useAuth } from "../../components/context/AuthProvider";
import { IconButton } from "@mui/material";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { toogleBan } from "../../service/admin";
import { useProfile } from "../../components/context/profile/ProfileProvider";
import { toast } from "react-toastify";
const MenuPost = ({ data }) => {
  const location = useLocation();
  const { profile } = useAuth();
  const { fetchProfile } = useProfile;
  const { setReport } = useModule();
  const [isActive, setIsActive] = useState();
  const menuItems = [
    { name: "Bài viết", link: "/profile/posts" },
    { name: "About", link: "/profile/about" },
    { name: "Bạn bè", link: "/profile/friends" },
    { name: "Videos", link: "/profile/videos" },
    { name: "Nhóm", link: "/profile/groups" },
  ];
  useEffect(() => {
    setIsActive(data?.profile?.banned);
  }, [data]);
  console.log(data);
  const handleReport = () => {
    setReport({ userId: data.profile._id });
  };
  const handleBan = async (id) => {
    try {
      await toogleBan(id);
      setIsActive(!isActive);
      toast.info(`bạn đã ${isActive ? " Mở Chặn " : " Chặn "} người dùng này`);
    } catch (err) {
      console.error("Failed to ban user", err);
    }
  };
  return (
    <div className="w-full shadow-gray-400 z-10 flex justify-between items-center">
      <div className="w-full flex justify-between items-center">
        <div className="space-x-1 flex flex-row flex-wrap">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.link;
            return (
              <div
                key={index}
                className={`flex items-center justify-center pt-1 ${
                  isActive
                    ? "border-b-4 border-violet-300"
                    : "border-b-4 border-transparent"
                } ${index > 1 && "sm:block hidden"}`}
              >
                <Link
                  to={`${item.link}${location.search}`}
                  className="hover:bg-gray-100 p-3 rounded-xl min-w-24 h-full text-center flex flex-col justify-center"
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
          <CustomizedMenus menu={menuItems} css="sm:hidden" />
        </div>

        {/* Nút Report */}
        {!data?.myProfile && (
          <div className="flex flex-wrap">
            {profile?.role == 1 && data?.profile?.role != 1 && (
              <button
                onClick={() => handleBan(data?.profile?._id)}
                className="mr-2 p-1 rounded hover:bg-red-100 transition"
                title={isActive ? "Bỏ chặn người dùng" : "Chặn người dùng"}
              >
                {isActive ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircleIcon className="h-6 w-6 text-red-600" />
                )}
              </button>
            )}

            <button
              onClick={handleReport}
              className="mr-2 p-1 rounded hover:bg-red-100 transition"
              title="Báo cáo vi phạm"
            >
              <FlagIcon className="h-6 w-6 text-red-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPost;
