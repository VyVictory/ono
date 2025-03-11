import React from "react";
import PostRight from "./profile/post/PostRigh";

const UserPage = () => {
  return (
    <div className="flex NavbarUser flex-col items-center  h-screen overflow-auto">
      <div className="max-w-[800px] px-4 md:px-0">
        <h1 className="text-4xl font-bold text-gray-800 text-center mt-2">
          Welcome to Home Pages
        </h1>
        <p className="text-lg text-gray-600 mt-2 text-center mb-2">
          This is your home page content.
        </p>
        <div className="space-y-4">
          <PostRight />
        </div>
      </div>
    </div>
  );
};

export default UserPage;
