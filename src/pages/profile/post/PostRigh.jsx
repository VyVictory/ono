import avt from "../../../img/DefaultAvatar.jpg";
import { UserGroupIcon } from "@heroicons/react/24/outline";
import pngTest from "../../../img/post/post.png";
import HeadCreatePost from "./HeadCreatePost";
import { usePhotoSwipe } from "../../../components/context/PhotoSwipeProvider";
const PostRight = ({ data }) => {
  const { openGallery } = usePhotoSwipe();
  return (
    <>
      {data?.myprofile && <HeadCreatePost />}
      <div id="gallery" className="flex flex-col gap-4">
        {[...Array(20)].map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 bg-white rounded-lg Post w-full ShadowContent"
          >
            <div className="pb-4 mx-6">
              <div className="flex flex-row space-x-2 items-center">
                <button>
                  <div className="w-10 h-10 rounded-full relative">
                    <img
                      className="w-10 h-10 rounded-full border-2 border-blue-200"
                      src={avt}
                      alt="user photo"
                    />
                  </div>
                </button>
                <div className="flex flex-col justify-center">
                  <div className="mt-2">Name</div>
                  <div className="text-gray-500 flex flex-row space-x-2 items-center">
                    <div>01/01/2025 lúc 12:23</div>
                    <div className="flex flex-row items-center">
                      <UserGroupIcon className="h-4 w-4 text-green-500" />
                      <div className="text-3xl">·</div>
                      <div>Friend</div>
                    </div>
                  </div>
                </div>
              </div>
              HÌNH ẢNH VÀ VIDEO BẠN ĐANG XEM LÀ 100% TỪ GAME...
            </div>
            <div id={`gallery-${index}`} className="w-full pb-6 border-b mb-2">
              <a
                href={pngTest}
                data-pswp-width="800"
                data-pswp-height="600"
                onClick={(e) => {
                  e.preventDefault();
                  openGallery(index, `gallery-${index}`);
                }}
              >
                <img src={pngTest} className="w-full h-auto cursor-pointer" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PostRight;
