import { UserGroupIcon } from "@heroicons/react/24/outline";
import pngTest from "../../img/post/post.png";
import { Avatar, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import UserStatusIndicator from "../UserStatusIndicator";
import SecurityLabel from "./SecurityLabel";
import FilePreview from "../FilePreview";

const Post = ({ data }) => {
  const [posts, setPosts] = useState(null);
  useEffect(() => {
    const fetchPosts = async () => {
      setPosts(data);
    };

    fetchPosts();
  }, [data]);
  const formatDate = (isoString) => {
    if (!isoString) return "Không có ngày";
    const date = new Date(isoString);
    return date
      .toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24h format
      })
      .replace(",", " lúc");
  };
  return (
    <>
      <div id="gallery" className="flex flex-col gap-4">
        {posts?.posts?.map((_, index) => (
          <Paper
            key={index}
            className="border border-gray-200 bg-white rounded-lg Post w-full ShadowContent"
          >
            <div className=" mx-2 ">
              <div className="flex flex-row space-x-2 items-center border-b p-1">
                <button>
                  <div className="w-10 h-10 rounded-full relative">
                    <UserStatusIndicator
                      userId={_?.author?._id}
                      // onlineUsers={onlineUsers}
                    />
                  </div>
                </button>
                <div className="flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-600">
                    {`${_?.author?.firstName
                      .charAt(0)
                      .toUpperCase()}${_?.author?.firstName.slice(1)} 
                    ${_?.author?.lastName
                      .charAt(0)
                      .toUpperCase()}${_?.author?.lastName.slice(1)}`}
                  </h2>
                  <div className="text-gray-500 flex flex-row flex-wrap items-center text-xs">
                    <div className="">{formatDate(_?.createdAt)}</div>
                    <div className="flex flex-row items-center">
                      <SecurityLabel security={_?.security} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 break-words">{_?.content}</div>
            </div>
            <div id={`gallery-${index}`} className="w-full  mb-2 ">
              <a data-pswp-width="800" data-pswp-height="600" >
                {_?.media.map((file, index) => (
                  <FilePreview key={index} fileUrl={file.url} />
                ))}
              </a>
            </div>
            {/* <div id={`gallery-${index}`} className="w-full pb-6 border-b mb-2">
              {_?.media?.length > 0 && 
              <div className="w-full h-auto cursor-pointer">daw
                </div>}
            </div> */}
          </Paper>
        ))}
      </div>
    </>
  );
};

export default Post;
