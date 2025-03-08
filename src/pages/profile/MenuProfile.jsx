import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/solid";
import CustomizedMenus from "./CustomizedMenus";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const MenuPost = () => {
  const location = useLocation(); // Lấy đường dẫn URL hiện tại

  const menuItems = [
    { name: "Bài viết", link: "/profile/posts" },
    { name: "About", link: "/profile/about" },
    { name: "Bạn bè", link: "/profile/friends" },
    { name: "Videos", link: "/profile/videos" },
    { name: "Nhóm", link: "/profile/groups" },
  ];

  return (
    <div className="w-full shadow-gray-400 z-10 flex justify-between items-center">
      <div className="w-full flex justify-between">
        <div className="space-x-1 flex flex-row flex-wrap ">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.link; // Kiểm tra trang hiện tại
            return (
              <div
                key={index}
                className={`flex items-center justify-center pt-1 ${
                  isActive
                    ? " border-b-4 border-violet-300"
                    : " border-b-4 border-transparent"
                } ${index > 1 && "sm:block hidden"}`}
              >
                <Link
                  to={`${item.link}${location.search}`} // Giữ nguyên query parameters
                  className="hover:bg-gray-100 p-3 rounded-xl min-w-24   h-full text-center flex flex-col justify-center"
                >
                  {item.name}
                </Link>
              </div>
            );
          })}
          <CustomizedMenus menu={menuItems} css="sm:hidden " />
        </div>
        <button className="md:mr-6">
          <MoreVertIcon className="h-8 w-8 hover:text-blue-400 hover:scale-125 bg-gray-50 hover:bg-gray-100 hover:rounded-md rounded-md p-1" />
        </button>
      </div>
    </div>
  );
};

export default MenuPost;
