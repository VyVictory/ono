import React from "react";
import { Link, useLocation } from "react-router-dom";
import FlagIcon from "@mui/icons-material/Flag"; // icon báo cáo
import CustomizedMenus from "./CustomizedMenus";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useModule } from "../../components/context/Module";

const MenuPost = ({ data }) => {
  const location = useLocation();
  const { setReport } = useModule();
  const menuItems = [
    { name: "Bài viết", link: "/profile/posts" },
    { name: "About", link: "/profile/about" },
    { name: "Bạn bè", link: "/profile/friends" },
    { name: "Videos", link: "/profile/videos" },
    { name: "Nhóm", link: "/profile/groups" },
  ];

  const handleReport = () => {
    setReport({ userId: data.profile._id });
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
          <button
            onClick={handleReport}
            className="mr-2 p-1 rounded hover:bg-red-100 transition"
            title="Báo cáo vi phạm"
          >
            <FlagIcon className="h-6 w-6 text-red-600" />
          </button>
        )}
        {/* Nút menu thêm */}
        {/* <button className="mr-4 p-1 rounded hover:bg-gray-100 transition">
          <MoreVertIcon className="h-6 w-6" />
        </button> */}
      </div>
    </div>
  );
};

export default MenuPost;
