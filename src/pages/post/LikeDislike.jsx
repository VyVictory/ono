import React, { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const LikeDislike = () => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setDisliked(false);
      console.log("Liked!");
    } else {
      setLiked(false);
      console.log("Unliked!");
    }
  };

  const handleDislike = () => {
    if (!disliked) {
      setDisliked(true);
      setLiked(false);
      console.log("Disliked!");
    } else {
      setDisliked(false);
      console.log("Undisliked!");
    }
  };

  const baseButton =
    "w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-all duration-300 ease-in-out hover:scale-110";

  const likeStyle = liked
    ? "  text-green-600 shadow-md"
    : "  text-gray-500 hover:text-green-500";
  const dislikeStyle = disliked
    ? "  text-red-600 shadow-md"
    : "  text-gray-500 hover:text-red-500";

  return (
    <div className="flex gap-4">
      <button onClick={handleLike} className={`${baseButton} ${likeStyle}`}>
        <FaThumbsUp size={18} />
      </button>
      <button
        onClick={handleDislike}
        className={`${baseButton} ${dislikeStyle}`}
      >
        <FaThumbsDown size={18} />
      </button>
    </div>
  );
};

export default LikeDislike;
