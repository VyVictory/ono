import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "../../components/context/AuthProvider";
import {
  ChevronDownIcon,
  PencilIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import avt from "../../img/DefaultAvatar.jpg";
import "../../css/post.css";
import ContentProfile from "./ContentProfile";
import pictureBG from "../../img/sky.webp";
import MenuProfile from "./MenuProfile";
import { useProfile } from "../../components/context/profile/ProfileProvider";
import AddFriend from "../../components/AddFriend";
import PostLeft from "./post/PostLeft";
import { useModule } from "../../components/context/Module";
import { useNavigate } from "react-router-dom";
import { getPostHome } from "../../service/post";
import { Button, ButtonBase } from "@mui/material";
import UserStatusIndicator from "../../components/UserStatusIndicator";
import { getFriendsMess } from "../../service/friend";
const Profile = () => {
  const { setZoomImg } = useModule();
  const { setUsecase } = useModule();
  const { profileRender, content } = useProfile();

  const [userRender, setUserRender] = useState(null);
  const [friends, setFrineds] = useState([]);
  const navigate = useNavigate();
  const [posts, setPosts] = useState(null);

  // Gọi API lấy danh sách bài viết
  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPostHome(0, 10); // Lấy 10 bài viết đầu tiên
      if (data) {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);
  useEffect(() => {
    const fetchFriend = async () => {
      const response = await getFriendsMess(0, 6, "");
      if (response) {
        setFrineds(response.data);
      }
    };

    fetchFriend();
  }, []);
  useEffect(() => {
    setUserRender(profileRender);
  }, [profileRender]);

  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto" });
  }, [userRender]);
  console.log(friends);
  const followersInfo = (
    <div className="text-center">0 followers ❁ 9 following</div>
  );
  if (userRender?.profile == null) {
    return (
      <div className="w-screen h-screen NavbarUser flex justify-center items-center">
        <svg className="animate-spin h-6 w-6 text-gray-500" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );
  }
  // console.log(userRender);
  return (
    <div className="NavbarUser ">
      <div className="w-full  flex-col relative min-h-screen ">
        <div className="w-full  flex items-center flex-col bg-white shadow-sm  shadow-slate-300">
          <div className="profileW w-full z-10 px-4">
            <div
              data-pswp-width="1920" // Thay đổi theo kích thước thực tế của ảnh
              data-pswp-height="1080" // Thay đổi theo kích thước thực tế của ảnh
              className="relative block w-full h-[40vh] rounded-b-xl profileW flex-shrink z-0"
            >
              <ButtonBase
                onClick={() => {
                  setZoomImg(profileRender?.profile?.coverPhoto || pictureBG);
                }}
                className="w-full h-full rounded-b-xl profileW flex-shrink z-0"
                style={{
                  backgroundImage: `url(${
                    profileRender?.profile?.coverPhoto || pictureBG
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div ref={scrollRef}></div>
                <span className="absolute inset-0 bg-black opacity-0 transition-opacity duration-200 hover:opacity-20 rounded-b-xl"></span>
              </ButtonBase>
            </div>

            <div className=" flex flex-col md:flex-row md:justify-between justify-center mx-10 md:py-2 border-b">
              <div className="flex md:flex-row items-center md:space-x-3 flex-col">
                <button className="w-36 h-36  rounded-full -mt-9 z-10 flex border-4 border-white">
                  <UserStatusIndicator
                    userId={profileRender?.profile?._id}
                    userData={{ avatar: profileRender?.profile?.avatar }}
                    styler={{
                      button: { width: "100%", height: "100%" }, // ✅ Avatar full button
                      avatar: { width: "100%", height: "100%" }, // ✅ Đảm bảo avatar không nhỏ hơn
                      badge: {
                        size: "14px", // ✅ Badge lớn hơn
                      },
                    }}
                  />
                </button>

                <div className="flex flex-col items-center">
                  <strong className="text-3xl text-center md:text-start w-full ">
                    {(userRender?.profile?.firstName ?? "") +
                      " " +
                      (userRender?.profile?.lastName ?? "")}
                  </strong>

                  {followersInfo}
                  <div className="flex flex-row">
                    {friends?.friends?.map((_, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 border-white border rounded-full mr-1"
                      >
                        <UserStatusIndicator
                          userId={_?._id}
                          userData={_}
                          // onlineUsers={onlineUsers}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* lựa chọn  */}
              {userRender.myprofile ? (
                <div className="flex flex-row md:flex-col md:items-center mb-2 md:mb-0 items-center justify-center space-y-0 md:space-y-2 space-x-2 md:space-x-0">
                  <button
                    onClick={() => {
                      setUsecase("EditProfile");
                    }}
                    className="bg-gray-50 hover:bg-violet-50 px-2 py-2 rounded-md flex items-center transition-transform duration-200 hover:scale-110"
                  >
                    <PencilIcon className="h-6 w-6 text-gray-500" />
                    Edit
                  </button>
                  <button className="bg-gray-50 hover:bg-violet-50 min-w-16 justify-center px-2 py-1 rounded-md flex items-center transition-transform duration-200 hover:scale-110">
                    <ChevronDownIcon className="w-8 h-8 text-gray-500 transition-transform duration-200 hover:scale-125 hover:text-violet-400" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-row flex-wrap items-center justify-center space-x-4 py-2 sm:pb-4">
                  {/* Nút Add Friend */}
                  <AddFriend profile={userRender.profile} />
                  {/* Nút Messenger */}
                  <div
                    onClick={() => {
                      navigate(
                        `/messages/inbox?idUser=${userRender.profile._id}`
                      );
                    }}
                    className="bg-gray-50 hover:bg-violet-50 min-w-16 justify-center px-2 py-1 rounded-md flex items-center transition-transform duration-200 hover:scale-110"
                  >
                    <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-gray-500 transition-transform duration-200 hover:scale-125 hover:text-violet-400" />
                  </div>
                </div>
              )}
            </div>
            <MenuProfile />
          </div>
        </div>

        <ContentProfile data={posts} content={content} />
      </div>
    </div>
  );
};

export default Profile;
