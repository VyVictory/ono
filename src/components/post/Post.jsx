import { UserGroupIcon } from "@heroicons/react/24/outline";
import pngTest from "../../img/post/post.png";
import { Avatar, Paper } from "@mui/material";

const Post = ({ data }) => {
  return (
    <>
      <div id="gallery" className="flex flex-col gap-4">
        {[...Array(20)].map((_, index) => (
          <Paper key={index} className="border Post w-full ">
            <div className="pb-4 mx-2 ">
              <div className="flex flex-row space-x-2 items-center border-b p-1">
                <button>
                  <div className="w-10 h-10 rounded-full relative">
                    <Avatar />
                  </div>
                </button>
                <div className="flex flex-col">
                  <div className=" ">Name</div>
                  <div className="text-gray-500 flex flex-row flex-wrap items-center text-xs">
                    <div className="">01/01/2025 lúc 12:23</div>
                    <div className="flex flex-row items-center ">
                      <UserGroupIcon className="h-6 w-6 text-green-500 px-1" />
                      <div className=" border-l-2 px-1">Friend</div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="p-2">
                HÌNH ẢNH VÀ VIDEO BẠN ĐANG XEM LÀ 100% TỪ GAME...
              </p>
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
          </Paper>
        ))}
      </div>
    </>
  );
};

export default Post;
