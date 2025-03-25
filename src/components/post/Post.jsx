import { UserGroupIcon } from "@heroicons/react/24/outline";
import pngTest from "../../img/post/post.png";
import { Avatar, Button, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import UserStatusIndicator from "../UserStatusIndicator";
import SecurityLabel from "./SecurityLabel";
import FilePreview from "../FilePreview";
import { Gallery } from "react-grid-gallery";
import { useModule } from "../context/Module";
import { Link } from "react-router-dom";
const MAX_VISIBLE_IMAGES = 6; // Hiển thị tối đa 6 ảnh
const Post = ({ data }) => {
  const { addPost, setAddPost } = useModule();
  const postsData = data?.posts || []; // ✅ Đảm bảo luôn có giá trị mặc định

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts(postsData);
  }, [data]); // ✅ Cập nhật lại posts khi data thay đổi

  useEffect(() => {
    if (addPost) {
      console.log(addPost);
      console.log(posts);
      setPosts((prevPosts) =>
        Array.isArray(prevPosts) ? [addPost, ...prevPosts] : [addPost]
      );
      setAddPost(null);
    }
  }, [addPost, setAddPost]);
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
  // console.log(posts);
  return (
    <>
      <div id="gallery" className="flex flex-col gap-4 min-w-full">
        {posts?.map((_, index) => (
          <Paper
            key={index}
            className="border border-gray-200 bg-white rounded-lg Post w-full ShadowContent"
          >
            <div className=" mx-2 ">
              <div className="flex flex-row space-x-2 items-center border-b p-1">
                <div>
                  <div className="w-10 h-10 rounded-full relative">
                    <UserStatusIndicator
                      userId={_?.author?._id}
                      userData={_?.author}
                      // onlineUsers={onlineUsers}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <Link
                    to={`/profile/posts?id=${_?.author?._id}`}
                    className="text-lg font-semibold text-gray-600 hover:text-violet-600"
                  >
                    {`${
                      _?.author?.firstName
                        ? _?.author?.firstName.charAt(0).toUpperCase() +
                          _?.author?.firstName.slice(1)
                        : "Unknown"
                    } 
                      ${
                        _?.author?.lastName
                          ? _?.author?.lastName.charAt(0).toUpperCase() +
                            _?.author?.lastName.slice(1)
                          : ""
                      }`}
                  </Link>
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
            {/* Bố cục hiển thị ảnh */}
            <div id={`gallery-${index}`} className="w-full mb-2 px-2">
              <div
                className={`grid gap-2 
                        ${_.media.length === 1 ? "grid-cols-1" : ""} 
                        ${_.media.length === 2 ? "grid-cols-2" : ""} 
                        ${_.media.length >= 3 ? "grid-cols-3" : ""}`}
              >
                {_.media.map((file, i) =>
                  i > MAX_VISIBLE_IMAGES - 2 ? (
                    ""
                  ) : (
                    <button
                      key={i}
                      className="bg-gray-200 flex justify-center items-center rounded-md overflow-hidden"
                    >
                      <FilePreview
                        fileUrl={file.url}
                        pop="w-full h-64 md:h-96 object-cover"
                      />
                    </button>
                  )
                )}

                {/* Hiển thị ô "+ số ảnh còn lại" nếu có ảnh dư */}
                {_.media.length - MAX_VISIBLE_IMAGES > 0 && (
                  <div className="relative flex items-center justify-center bg-gray-200 rounded-md overflow-hidden">
                    <span className="absolute text-xl font-bold text-white bg-black bg-opacity-50 px-4 py-2 rounded-md">
                      +{_.media.length - MAX_VISIBLE_IMAGES}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Paper>
        ))}
      </div>
    </>
  );
};

export default Post;
