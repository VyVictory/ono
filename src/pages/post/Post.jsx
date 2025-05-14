import {
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ButtonBase, Modal, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import UserStatusIndicator from "../../components/UserStatusIndicator";
import SecurityLabel from "./SecurityLabel";
import FilePreview from "../../components/FilePreview";
import { useModule } from "../../components/context/Module";
import { Link, useActionData } from "react-router-dom";
import { CommentSection as Comment } from "./CommentSection";
import { BookmarkBorderSharp, Share } from "@mui/icons-material";
import LikeDislike from "./LikeDislike";
import { ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import MenuPost from "./MenuPost";
import { useAuth } from "../../components/context/AuthProvider";
import { useConfirm } from "../../components/context/ConfirmProvider";
import { toast } from "react-toastify";
import { createBookmark } from "../../service/bookmark";
const MAX_VISIBLE_IMAGES = 3; // Hiển thị tối đa 6 ảnh
const Post = ({ data }) => {
  const { addPost, setAddPost, postUpdateData, setPostUpdateData, cmtVisible } =
    useModule();
  const confirm = useConfirm(); // Sửa lại như trong AddFriend

  const { profile } = useAuth();
  const postsData = data?.posts || data || []; // ✅ Đảm bảo luôn có giá trị mặc định
  const [openGalleryIndex, setOpenGalleryIndex] = useState(null); // index của post
  const [openCmt, setOpenCmt] = useState(false); // index của post
  const [expandedPosts, setExpandedPosts] = useState({});
  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    console.log(postsData);
    setPosts(postsData);
  }, [data]); // ✅ Cập nhật lại posts khi data thay đổi
  useEffect(() => {
    if (postUpdateData) {
      setPosts((prev) =>
        prev.map((p) => (p._id === postUpdateData._id ? postUpdateData : p))
      );
      setPostUpdateData(null);
    }
  }, [postUpdateData, setPosts, setPostUpdateData]);
  useEffect(() => {
    posts.length == 1 && cmtVisible && setOpenCmt(posts[0]._id);
  }, [cmtVisible, posts]);
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
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Vừa xong";
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay === 1) return "Hôm qua";

    return date
      .toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", " lúc");
  };
  const addBookmark = async (postId) => {
    const isConfirmed = await confirm("Bạn có chắc muốn thêm bài này vào bookmark?");
    if (!isConfirmed) return;

    const res = await createBookmark(postId);  
    console.log(res);

    if (res.status === 200 || res.status === 201) {
      toast.success("Đã thêm bài viết này vào bookmark");
    } else {
      toast.error(
        res.data?.message || "Lỗi khi thêm bài viết này vào bookmark"
      );
    }
  };

  const handleOpenGallery = (index) => {
    setOpenGalleryIndex(index);
  };

  const handleCloseGallery = () => {
    setOpenGalleryIndex(null);
  };
  return (
    <>
      <div id="gallery" className="flex flex-col gap-4 min-w-full">
        {posts?.map((_, index) => (
          <Paper key={index} className=" w-full">
            <div className=" mx-2 ">
              <div className="flex flex-row  items-center border-b p-1 pr-0 justify-between">
                <div className="flex flex-row space-x-2">
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
                      className="text-sm font-semibold text-gray-600 hover:text-black"
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
                <MenuPost data={_} setPosts={setPosts} />
              </div>
              {_?.content?.trim() && (
                <div className="p-2 break-words break-all whitespace-pre-wrap w-full text-gray-800">
                  {expandedPosts[_._id] || _?.content.length <= 300
                    ? _?.content
                    : `${_?.content.slice(0, 300)}...`}
                  {_?.content.length > 300 && (
                    <button
                      onClick={() => toggleExpand(_._id)}
                      className="ml-1 text-blue-500 hover:underline font-medium"
                    >
                      {expandedPosts[_._id] ? "Ẩn bớt" : "Xem thêm"}
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* Bố cục hiển thị ảnh */}
            <div className="w-full">
              <div className="w-full">
                <div
                  className={`grid gap-2 p-2 ${
                    _.media.length === 1
                      ? "grid-cols-1"
                      : _.media.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {_.media.slice(0, MAX_VISIBLE_IMAGES).map((file, i) => {
                    const isLastVisible = i === MAX_VISIBLE_IMAGES - 1;
                    const remaining = _.media.length - MAX_VISIBLE_IMAGES;

                    return (
                      <div
                        key={i}
                        onClick={() =>
                          isLastVisible &&
                          remaining > 0 &&
                          handleOpenGallery(index)
                        }
                        className="relative cursor-pointer rounded-md overflow-hidden group"
                      >
                        <FilePreview
                          fileUrl={file.url}
                          pop="w-full h-auto max-h-[100dvh] object-cover group-hover:brightness-90 transition"
                        />
                        {isLastVisible && remaining > 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">
                              +{remaining}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="border-t mx-2 flex justify-between items-center p-2">
                <div className="flex items-center space-x-4 text-gray-600">
                  <LikeDislike data={_} />
                  <button
                    onClick={() => setOpenCmt(openCmt === _._id ? null : _._id)}
                    className="flex items-center space-x-1"
                  >
                    <ChatBubbleLeftRightIcon className="text-gray-500 w-6 aspect-square" />
                  </button>

                  <button className="hover:text-blue-500 transition">
                    <Share className="w-6 h-6" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    addBookmark(_._id);
                  }}
                  className="hover:text-yellow-500 transition"
                >
                  <BookmarkBorderSharp />
                </button>
              </div>
            </div>
            {openCmt === _._id && <Comment postId={_._id} open={true} />}
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
          className="flex items-center justify-center min-h-screen p-0 sm:p-4 bg-black bg-opacity-80"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-gray-100 rounded-lg w-full max-w-5xl max-h-[90vh]  flex flex-col overflow-hidden shadow-lg"
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

            <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {openGalleryIndex !== null &&
                  posts[openGalleryIndex]?.media.map((file, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden hover:brightness-110 transition"
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
