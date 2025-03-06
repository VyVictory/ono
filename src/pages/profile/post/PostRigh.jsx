import avt from "../../../img/DefaultAvatar.jpg";
import {
  UserPlusIcon,
  VideoCameraIcon,
  PhotoIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import pngTest from "../../../img/post/post.png";

const PostRight = () => {
  return (
    <>
      <div className="border border-gray-200 bg-white rounded-lg Post px-4 py-2 w-full ShadowContent">
        <div className="border-b flex flex-row pb-2 space-x-2">
          <button className="" onClick={() => setIsOpen(!isOpen)}>
            <div className="w-10 h-10 rounded-full relative">
              <img
                className="w-10 h-10 rounded-full border-2 border-blue-200 "
                src={avt}
                alt="user photo"
              />
            </div>
          </button>
          <button className="w-full bg-gray-100 rounded-3xl p-2 text-start text-gray-500">
            Viết bài viết ...
          </button>
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
      {[...Array(20)].map((_, index) => (
        <div key={index} className="border border-gray-200 bg-white rounded-lg Post w-full ShadowContent">
          <div className="  pb-4 mx-6">
            <div className="flex flex-row   space-x-2 items-center ">
              <button className="">
                <div className="w-10 h-10 rounded-full relative">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-blue-200 "
                    src={avt}
                    alt="user photo"
                  />
                </div>
              </button>
              <div className="flex flex-col justify-center">
                <div className="mt-2">Name</div>
                <div className="text-gray-500 flex flex-row flex-wrap space-x-2 items-center">
                  <div>01/01/2025 lúc 12:23</div>
                  <div className=" flex flex-row items-center">
                    <UserGroupIcon className="h-4 w-4 text-green-500" />
                    <div className="text-3xl">·</div>
                    <div>Friend</div>
                  </div>
                </div>
              </div>
            </div>
            HÌNH ẢNH VÀ VIDEO BẠN ĐANG XEM LÀ 100% TỪ GAME Tặng VIPcode: VIP666
            l DGDL999 l RONGTHAN Webgame chơi Online ngay trên PC Game MMO
            Fantasy phép thuật, cơ giáp và luyện rồng Luyện BOSS tay to, rơi đồ
            kín màn hình Bản đồ siêu lớn, khám phá miễn phí Auto tiện ích miễn
            phí, treo máy dễ dàng, cân bằng học tập và làm việc.
          </div>
          <div className="w-full pb-6 border-b mb-2">
            <img src={pngTest} className="w-full h-auto" />
          </div>
        </div>
      ))}
    </>
  );
};

export default PostRight;
