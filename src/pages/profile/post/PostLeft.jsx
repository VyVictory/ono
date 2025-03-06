import { HeartIcon } from "@heroicons/react/24/outline";
import {
  UserPlusIcon,
  BriefcaseIcon,
  BookOpenIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import { useProfile } from "../../../components/context/profile/ProfileProvider";
const PostLeft = ({ data }) => {
  const iconSize = "w-8 h-8";
  return (
    <>
      <div
        className={`border border-gray-200 bg-white rounded-lg Post p-4 space-y-3 ShadowContent `}
      >
        <strong className="text-lg">Giới thiệu</strong>
        <div className="w-full border-b text-center pb-4 text-gray-500">
          chưa thiết lập
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <div
            className={`${iconSize} text-white rounded-full bg-gray-500 text-2xl text-center`}
          >
            i
          </div>
          <div>chưa thiết lập</div>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <HeartIcon className={`${iconSize}text-gray-500`} />
          <div>chưa thiết lập</div>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 128 128"
            className={`${iconSize} text-red-500`}
          >
            <path d="M98.09 29.792H29.9a5.708 5.708 0 0 0-5.7 5.708v44.334a5.709 5.709 0 0 0 5.7 5.708h25.76L64 98.208l8.33-12.666h25.76a5.708 5.708 0 0 0 5.708-5.708V35.5a5.707 5.707 0 0 0-5.708-5.708z" />
            <circle cx="56.135" cy="49.418" r="7.6" className="fill-white" />
            <path
              d="M56.135 57.018A16.138 16.138 0 0 0 40 73.156h32.273a16.138 16.138 0 0 0-16.138-16.138zM88 68.013h-1.571V44.767a1.75 1.75 0 0 0-2.724-1.454L80.136 45.7a1.75 1.75 0 1 0 1.947 2.908l.846-.567v19.972h-1.82a1.75 1.75 0 0 0 0 3.5H88a1.75 1.75 0 0 0 0-3.5z"
              className="fill-white"
            />
          </svg>
          <div>
            Có
            <a className="mx-2">0</a>
            người theo dõi
          </div>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <MapPinIcon className={`${iconSize} text-gray-500`} />
          <div>
            {data?.profile?.address?.street ||
            data?.profile?.address?.ward ||
            data?.profile?.address?.district ||
            data?.profile?.address?.country ||
            data?.profile?.address?.city ? (
              <>
                {data.profile?.address.street &&
                  `${data.profile?.address.street}, `}
                {data.profile?.address.ward &&
                  `${data.profile?.address.ward}, `}
                {data.profile?.address.district &&
                  `${data.profile?.address.district}, `}
                {data.profile?.address.city &&
                  `${data.profile?.address.city}, `}
                {data.profile?.address.country}
              </>
            ) : (
              "chưa thiết lập"
            )}
          </div>
        </div>

        <div className="flex flex-row space-x-2 items-center">
          <BriefcaseIcon className={`${iconSize} text-gray-500`} />
          <div>chưa thiết lập</div>
        </div>
        <div className="flex flex-row space-x-2 items-center">
          <BookOpenIcon className={`${iconSize} text-gray-500`} />
          <div>chưa thiết lập</div>
        </div>
      </div>
      <div
        className={`border border-gray-200 bg-white rounded-lg Post p-4 space-x-3 ShadowContent r`}
      >
        <div className="w-full flex flex-row justify-between items-center  pb-2">
          <strong className="text-lg">Ảnh</strong>
          <button className="bg-gray-50 hover:bg-gray-200 text-blue-500 p-2 rounded-lg hover:scale-110">
            Xem tất cả
          </button>
        </div>
        <div className="text-gray-500 text-center py-12">Hiện không có ảnh</div>
      </div>
      <div
        className={`border border-gray-200 bg-white rounded-lg Post p-4 space-x-3 ShadowContent r`}
      >
        <div className="w-full flex flex-row justify-between items-center  pb-2">
          <strong className="text-lg">Video</strong>
          <button className="bg-gray-50 hover:bg-gray-200 text-blue-500 p-2 rounded-lg hover:scale-110">
            Xem tất cả
          </button>
        </div>
        <div className="text-gray-500 text-center py-12">
          Hiện không có video
        </div>
      </div>
      <div className="text-gray-500 text-center space-y-2">
        <div>
          <a href="#">Quyền riêng tư</a> · <a href="#">Điều khoản</a> ·{" "}
          <a href="#">Hỗ trợ </a>· <a href="#">Liên hệ chủ page</a>
        </div>
        <div>
          Cookie ·<a href="#">xem thêm</a> · Meta © 2025
        </div>
      </div>
      {/* {[...Array(6)].map((_, index) => (
        <div
          className={`border border-gray-200 bg-white rounded-lg Post p-2 ShadowContent `}
          key={index}
        >
          HÌNH ẢNH VÀ VIDEO BẠN ĐANG XEM LÀ 100% TỪ GAME Tặng VIPcode: VIP666 l
          DGDL999 l RONGTHAN Webgame chơi Online ngay trên PC Game MMO Fantasy
          phép thuật, cơ giáp và luyện rồng Luyện BOSS tay to, rơi đồ kín màn
          hình Bản đồ siêu lớn, khám phá miễn phí Auto tiện ích miễn phí, treo
          máy dễ dàng, cân bằng học tập và làm việc.{index}
        </div>
      ))} */}
    </>
  );
};

export default PostLeft;
