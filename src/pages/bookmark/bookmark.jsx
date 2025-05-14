import React, { useEffect, useState } from "react";
import Post from "../post/Post";
import HeadCreatePost from "../profile/post/HeadCreatePost";
import LoadingAnimation from "../../components/LoadingAnimation";
import { getPostHome } from "../../service/post";
import { deleteBookmark, getBookmark } from "../../service/bookmark";
import { useAuth } from "../../components/context/AuthProvider";
import { X } from "@mui/icons-material";
import { useConfirm } from "../../components/context/ConfirmProvider";
import { toast } from "react-toastify";
import { Paper } from "@mui/material";

const Bookmark = () => {
  const { profile, isLoadingProfile } = useAuth();
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const confirm = useConfirm(); // Sửa lại như trong AddFriend
  // Gọi API lấy danh sách bài viết
  const fetchPosts = async () => {
    setIsLoading(true);
    const data = await getPostHome(0, 10); // Lấy 10 bài viết đầu tiên
    const res = await getBookmark();

    const newPosts = res.map((item) => item.post);
    console.log(newPosts);
    if (newPosts) {
      setPosts(newPosts);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDeleteBookmark = async (postId) => {
    const isConfirmed = await confirm(
      "Bạn có chắc muốn xóa bài viết này khỏi bookmark?"
    );
    if (!isConfirmed) return;

    const res = await deleteBookmark(postId);
    toast.success("Đã xóa viết này khỏi bookmark");
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (isLoadingProfile) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="flex py-4 flex-col items-center h-screen overflow-auto">
      <div className="max-w-[700px] px-3 xl:px-0  space-y-3 w-full flex items-center flex-col">
        <strong className="text-center text-blue-500 uppercase">Bài viết đã lưu</strong>
        <div className={`space-y-4 min-w-full relative`}>
          {isLoading ? (
            <LoadingAnimation />
          ) : posts?.length > 0 ? (
            posts.map((post, i) => (
              <div className="relative">
                <div
                  onClick={() => {
                    handleDeleteBookmark(post?._id);
                  }}
                >
                  <X
                    fontSize="small"
                    className="right-12 text-gray-500 hover:scale-110 cursor-pointer top-4 absolute"
                  />
                </div>

                <Post data={{ posts: [post] }} />
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              Không có bài viết nào được lưu ở đây.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookmark;
