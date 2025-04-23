import React, { useEffect, useState } from "react";
import PostRight from "./profile/post/PostRigh";
import PostModal from "../components/PostModal";
import { useAuth } from "../components/context/AuthProvider";
import Post from "./post/Post";
import HeadCreatePost from "./profile/post/HeadCreatePost";
import LoadingAnimation from "../components/LoadingAnimation";
import { getPostHome } from "../service/post";

const UserPage = () => {
  const { profile, isLoadingProfile } = useAuth();
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Gọi API lấy danh sách bài viết
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const data = await getPostHome(0, 10); // Lấy 10 bài viết đầu tiên
      if (data) {
        setPosts(data);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);
  if (isLoadingProfile) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div className="flex py-4 flex-col items-center h-screen overflow-auto">
      <div className="max-w-[700px] px-3 xl:px-0  space-y-3 w-full">
        <HeadCreatePost />
        <div className={`space-y-4 min-w-full relative`}>
          {isLoading ? (
            <LoadingAnimation />
          ) : posts?.posts?.length > 0 ? (
            <Post data={posts} />
          ) : (
            <p className="text-gray-500 text-center">Không có bài viết nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
