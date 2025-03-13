import React from "react";
import PostRight from "./profile/post/PostRigh";
import PostModal from "../components/PostModal";
import { useAuth } from "../components/context/AuthProvider";
const UserPage = () => {
  const { profile, isLoadingProfile } = useAuth();
  if (isLoadingProfile) {
    return (
      <div className="w-screen h-screen NavbarUser flex justify-center items-center">
        <svg className="animate-spin h-6 w-6 " viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="flex NavbarUser flex-col items-center  h-screen overflow-auto">
      <div className="max-w-[800px] px-3 md:px-0">
        <h1 className="text-4xl font-bold   text-center mt-2">
          Welcome to Home Pages
        </h1>
        <p className="text-lg   mt-2 text-center mb-2">
          This is your home page content.
        </p>
        <PostModal />

        <div className="space-y-4">
          <PostRight data={{ myprofile: true, profile: profile }} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
