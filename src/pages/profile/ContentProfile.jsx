import React, { useState, useEffect } from "react";
import { useAuth } from "../../components/context/AuthProvider";
import "../../css/post.css";
import PostProfile from "./post/PostProfile";
import PostLeft from "./post/PostLeft";
const ContentProfile = ({ data, content }) => {
  const eventProfile = (profile) => {
    switch (content) {
      case "about":
        return <PostLeft data={profile} />;
      default:
        return <PostProfile data={profile} />;
    }
  };
  return (
    <div className="flex justify-center">
      <div className="profileW w-full p-3 md:p-3">{eventProfile(data)}</div>
    </div>
  );
};

export default ContentProfile;
