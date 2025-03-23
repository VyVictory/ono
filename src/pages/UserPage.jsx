import React from "react";
import PostRight from "./profile/post/PostRigh";
import PostModal from "../components/PostModal";
import { useAuth } from "../components/context/AuthProvider";
import Post from "../components/post/Post";
import HeadCreatePost from "./profile/post/HeadCreatePost";
import LoadingAnimation from "../components/LoadingAnimation";
const UserPage = () => {
  const { profile, isLoadingProfile } = useAuth();
  if (isLoadingProfile) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <LoadingAnimation />
      </div>
    );
  }
  
  return (
    <div className="flex py-4 flex-col items-center  h-screen overflow-auto">
      <div className="max-w-[800px] px-3 md:px-0 space-y-3">
        {/* <PostModal /> */}
        <HeadCreatePost />
        <div className="space-y-4">
          <Post />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
