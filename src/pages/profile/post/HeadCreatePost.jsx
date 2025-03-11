import {
  UserPlusIcon,
  VideoCameraIcon,
  PhotoIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import avt from "../../../img/DefaultAvatar.jpg";
import { useAuth } from "../../../components/context/AuthProvider";
import PostModal from "../../../components/PostModal";
const HeadCreatePost = () => {
  const { profile, isLoadingProfile } = useAuth();
  return (
    <div className="border border-gray-200 bg-white rounded-lg Post px-4 py-2 w-full ShadowContent">
      <div className="border-b flex flex-row pb-2 space-x-2">
        <button className="">
          <div className="w-10 h-10 rounded-full relative">
            <img
              className="w-10 h-10 rounded-full border-2 border-blue-200 "
              src={avt}
              alt="user photo"
            />
          </div>
        </button>
        <PostModal>
          <button className="w-full bg-gray-100 rounded-3xl p-2 text-start text-gray-500 hover:bg-violet-50">
            Viết bài viết ...
          </button>
        </PostModal>
      </div>
      <div className="pt-2 flex flex-row flex-wrap w-full justify-between">
        <button className="flex flex-row p-2 bg-gray-50 rounded-lg space-x-2 hover:bg-gray-100">
          <PhotoIcon className="h-6 w-6 text-blue-500" />
          <span>Hình ảnh/Video</span>
        </button>
        <button className="flex flex-row p-2 bg-gray-50 rounded-lg space-x-2 hover:bg-gray-100">
          <VideoCameraIcon className="h-6 w-6 text-red-500" />
          <span>Đăng video</span>
        </button>
        <button className="flex flex-row p-2 bg-gray-50 rounded-lg space-x-2 hover:bg-gray-100">
          <UserPlusIcon className="h-6 w-6 text-green-500" />
          <span>Tag bạn bè</span>
        </button>
      </div>
    </div>
  );
};

export default HeadCreatePost;
