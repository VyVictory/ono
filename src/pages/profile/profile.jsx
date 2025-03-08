import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  use,
} from "react";
import { useAuth } from "../../components/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import {
  ChevronDownIcon,
  Bars3Icon,
  PencilIcon,
  UserPlusIcon,
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
  UserMinusIcon,
} from "@heroicons/react/24/solid";
import ConfirmDialog from "../../components/ConfirmDialog";
import avt from "../../img/DefaultAvatar.jpg";
import "../../css/post.css";
import ContentProfile from "./post/ContentProfile";
import pictureBG from "../../img/sky.webp";
import MenuProfile from "./MenuProfile";
import { useProfile } from "../../components/context/profile/ProfileProvider";
import { m } from "framer-motion";
import { useConfirm } from "../../components/context/ConfirmProvider";
import { addFriend, getStatusByIdUser } from "../../service/friend";

const Profile = () => {
  const { profile, isLoadingProfile } = useAuth();
  const {
    setIdUser,
    setCurrentUser,
    currentUser,
    setLoading,
    loading,
    setProfileRender,
    profileRender,
    content,
    setContent,
  } = useProfile();

  const [loadingAddFriend, setLoadingAddFriend] = useState(false);

  const confirm = useConfirm();

  const handleAddFriend = async (idUser) => {
    if (loadingAddFriend) return; // Tránh spam click

    setLoadingAddFriend(true); // Bắt đầu trạng thái loading
    try {
      const isConfirmed = await confirm("Bạn có chắc muốn kết bạn?");
      if (!isConfirmed) {
        setLoadingAddFriend(false);
        return;
      }

      console.log("Đang gửi yêu cầu kết bạn ID:", idUser);
      const result = await addFriend(idUser);
      setProfileRender((prev) => ({
        ...prev,
        profile: { ...prev.profile, friendStatus: "waiting" },
      }));
      console.log(result?.message || "Yêu cầu kết bạn đã được gửi.");
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
    } finally {
      setLoadingAddFriend(false); // Kết thúc loading khi có phản hồi
    }
  };

  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  useEffect(() => {
    if (currentUser != null) {
      setProfileRender({ myprofile: false, profile: currentUser });
    } else if (!id && isLoadingProfile == false) {
      setProfileRender({ myprofile: true, profile: profile });
    }
  }, [currentUser, isLoadingProfile]);
  useEffect(() => {
    const fetchData = async () => {
      console.log("profileRender", profileRender);
      try {
        if (!profileRender.profile._id) return;
        const statusData = await getStatusByIdUser(profileRender.profile._id);
        console.log(statusData);
      } catch (error) {
        console.error("Lỗi khi lấy trạng thái bạn bè:", error);
      }
    };

    fetchData();
  }, [profileRender]); // Chỉ theo dõi _id thay vì cả profileRender

  const scrollRef = useRef(null);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [profileRender]);

  const followersInfo = useMemo(
    () => <div className="text-center">0 followers ❁ 9 following</div>,
    []
  );
  if (profileRender == null) {
    return <div>Loading...</div>;
  }
  return (
    <div className="NavbarUser ">
      <div className="w-full  flex-col relative min-h-screen ">
        <div className="w-full  flex items-center flex-col bg-white shadow-sm  shadow-slate-300">
          <div className="profileW w-full z-10 px-4">
            <button
              // onClick={() => {}
              className="relative h-[40vh] w-full rounded-b-xl profileW flex-shrink z-0"
              style={{
                backgroundImage: `url(${pictureBG})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div ref={scrollRef}></div>
              <span className="absolute inset-0 bg-black opacity-0 transition-opacity duration-200 hover:opacity-20 rounded-b-xl"></span>
            </button>
            <div className=" flex flex-col md:flex-row md:justify-between justify-center mx-10 md:py-2 border-b">
              <div className="flex md:flex-row items-center md:space-x-3 flex-col">
                <button className="w-36 h-36 border-4 border-white rounded-full -mt-9 z-10">
                  <img
                    className="w-full rounded-full"
                    src={avt}
                    alt="Profile"
                    loading="lazy"
                  />
                </button>
                <div className="flex flex-col items-center">
                  <strong className="text-3xl text-center md:text-start w-full ">
                    {(profileRender?.profile?.firstName ?? "") +
                      " " +
                      (profileRender?.profile?.lastName ?? "")}
                  </strong>

                  {followersInfo}
                  <div>
                    {[...Array(6)].map((_, index) => (
                      <button
                        key={index}
                        className="w-8 h-8 border-white border rounded-full -ml-2"
                      >
                        <img
                          className="w-full rounded-full"
                          src={avt}
                          alt=""
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* lựa chọn  */}
              {profileRender.myprofile ? (
                <div className="flex flex-row md:flex-col md:items-center mb-2 md:mb-0 items-center justify-center space-y-0 md:space-y-2 space-x-2 md:space-x-0">
                  <button className="bg-gray-50 hover:bg-violet-50 px-2 py-2 rounded-md flex items-center transition-transform duration-200 hover:scale-110">
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
                  <button
                    onClick={() => handleAddFriend(profileRender.profile._id)}
                    disabled={loadingAddFriend}
                    className={`bg-gray-50 px-2 py-2 rounded-md flex items-center transition-transform duration-200 ${
                      loadingAddFriend
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-green-50 hover:scale-110"
                    }`}
                  >
                    {loadingAddFriend ? (
                      <svg
                        className="animate-spin h-6 w-6 text-gray-500"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      <>
                        {profileRender.profile.friendStatus === "waiting" && (
                          <>
                            <XMarkIcon className="h-6 w-6 text-red-500" />
                            <span className="ml-1 text-gray-700">
                              Hủy yêu cầu
                            </span>
                          </>
                        )}

                        {profileRender.profile.friendStatus === "pending" && (
                          <>
                            <XMarkIcon className="h-6 w-6 text-red-500" />
                            <span className="ml-1 text-gray-700">từ chối</span>
                          </>
                        )}

                        {profileRender.profile.friendStatus === "friend" && (
                          <>
                            <UserMinusIcon className="h-6 w-6 text-gray-500" />
                            <span className="ml-1 text-gray-700">Unfriend</span>
                          </>
                        )}

                        {profileRender.profile.friendStatus === "noFriend" && (
                          <>
                            <UserPlusIcon className="h-6 w-6 text-gray-500" />
                            <span className="ml-1 text-gray-700">
                              Add Friend
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </button>

                  {/* Nút Messenger */}
                  <button className="bg-gray-50 hover:bg-violet-50 min-w-16 justify-center px-2 py-1 rounded-md flex items-center transition-transform duration-200 hover:scale-110">
                    <ChatBubbleLeftEllipsisIcon className="w-8 h-8 text-gray-500 transition-transform duration-200 hover:scale-125 hover:text-violet-400" />
                  </button>
                </div>
              )}

              {/* {result !== null && (
                <p className="mt-4 text-lg">
                  Bạn đã chọn: {result ? "✅ Xác nhận" : "❌ Hủy"}
                </p>
              )} */}
            </div>
            <MenuProfile />
          </div>
        </div>

        {/* left lăn hết mới được lăn right*/}
        {content == null || content == "posts" ? (
          <ContentProfile data={profileRender} />
        ) : null}
      </div>
    </div>
  );
};

export default Profile;
