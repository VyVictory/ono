import { UserGroupIcon, XCircleIcon } from "@heroicons/react/24/outline";
import pngTest from "../../img/post/post.png";
import { Avatar, Button, ButtonBase, Modal, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import UserStatusIndicator from "../UserStatusIndicator";
import SecurityLabel from "./SecurityLabel";
import FilePreview from "../FilePreview";
import { Gallery } from "react-grid-gallery";
import { useModule } from "../context/Module";
import { Link } from "react-router-dom";
const MAX_VISIBLE_IMAGES = 3; // Hiển thị tối đa 6 ảnh
const Post = ({ data }) => {
  const { addPost, setAddPost } = useModule();
  const postsData = data?.posts || []; // ✅ Đảm bảo luôn có giá trị mặc định
  const [openGalleryIndex, setOpenGalleryIndex] = useState(null); // index của post

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
  const handleOpenGallery = (index) => {
    setOpenGalleryIndex(index);
  };

  const handleCloseGallery = () => {
    setOpenGalleryIndex(null);
  };

  // console.log(posts);
  return (
    <>
      <div id="gallery" className="flex flex-col gap-4 min-w-full">
        {posts?.map((_, index) => (
          <Paper key={index} className=" w-full">
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
                    className="text-sm font-semibold text-gray-600 hover:text-violet-600"
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
              <div className="p-2 break-words break-all whitespace-pre-wrap w-full">
                {_?.content}
              </div>
            </div>
            {/* Bố cục hiển thị ảnh */}
            <div id={`gallery-${index}`} className="w-full">
              <div
                className={`grid gap-2  p-2
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
                      className=" flex justify-center  items-center rounded-md overflow-hidden"
                    >
                      <FilePreview
                        fileUrl={file.url}
                        pop="w-full h-auto max-h-60 object-cover"
                      />
                    </button>
                  )
                )}

                {/* Hiển thị ô "+ số ảnh còn lại" nếu có ảnh dư */}
                {_.media.length - MAX_VISIBLE_IMAGES > 0 && (
                  <div
                    onClick={() => handleOpenGallery(index)}
                    className="relative cursor-pointer flex items-center justify-center bg-gray-200 rounded-md overflow-hidden"
                  >
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
      <Modal
        open={openGalleryIndex !== null}
        onClose={handleCloseGallery}
        aria-labelledby="image-gallery-modal"
        aria-describedby="show-all-images"
      >
        <div
          onClick={handleCloseGallery}
          className="flex items-center justify-center min-h-screen p-4 bg-black bg-opacity-80"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gray-100 rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-lg"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white p-2 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Tất cả hình ảnh
              </h2>
              <ButtonBase onClick={handleCloseGallery}>
                <XCircleIcon className="w-8 h-8 hover:scale-110 text-red-500" />
              </ButtonBase>
            </div>

            {/* Nội dung ảnh */}
            <div className="p-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {openGalleryIndex !== null &&
                  posts[openGalleryIndex]?.media.map((file, i) => (
                    <div
                      key={i}
                      className="rounded-md bg-white overflow-hidden flex justify-center items-center"
                    >
                      <FilePreview
                        fileUrl={file.url}
                        pop="w-full h-64 md:h-72 object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Post;
