import React, { useEffect, useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { checkCount, checkLike, like, unLike } from "../../service/like";

const LikeDislike = ({ data }) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [countLike, setCountLike] = useState({ likeCount: 0, dislikeCount: 0 });
  const fetchCount = async () => {
    const count = await checkCount("post", data?._id);
    setCountLike(count); 
  };
  const fetchCheck = async () => {
    try {
      const res = await checkLike("post", data?._id);
      const status = res?.data?.status;
      if (status === "like") {
        setLiked(true);
        setDisliked(false);
      } else if (status === "dislike") {
        setLiked(false);
        setDisliked(true);
      } else {
        setLiked(false);
        setDisliked(false);
      }
    } catch (error) {
      console.error("Failed to check like status:", error);
    }
  };

  useEffect(() => {
    if (data?._id) {
      fetchCheck();
    }
    fetchCount();
  }, [data?._id]);

  const handleLike = async () => {
    if (liked) {
      await unLike("post", data?._id);
      setLiked(false);
    } else {
      await like("post", data?._id, true);
      setLiked(true);
      setDisliked(false);
    }
    fetchCount();
  };

  const handleDislike = async () => {
    if (disliked) {
      await unLike("post", data?._id);
      setDisliked(false);
    } else {
      await like("post", data?._id, false);
      setDisliked(true);
      setLiked(false);
    }
    fetchCount();
  };

  const baseButton =
    "w-8 h-8 flex items-center justify-center rounded-full shadow-sm transition-all duration-300 ease-in-out hover:scale-110";

  const likeStyle = liked
    ? "text-green-600 shadow-md"
    : "text-gray-500 hover:text-green-500";
  const dislikeStyle = disliked
    ? "text-red-600 shadow-md"
    : "text-gray-500 hover:text-red-500";

  return (
    <div className="flex gap-6 items-center">
      <div className="relative">
        <button onClick={handleLike} className={`${baseButton} ${likeStyle}`}>
          <FaThumbsUp size={20} />
        </button>
        <span className="absolute -top-2 -right-2   text-green-500 text-xs font-semibold px-1.5 py-0.5 rounded-full shadow">
          {countLike?.likeCount || 0}
        </span>
      </div>

      <div className="relative">
        <button
          onClick={handleDislike}
          className={`${baseButton} ${dislikeStyle}`}
        >
          <FaThumbsDown size={20} />
        </button>
        <span className="absolute -top-2 -right-2   text-red-500 text-xs font-semibold px-1.5 py-0.5 rounded-full shadow">
          {countLike?.dislikeCount || 0}
        </span>
      </div>
    </div>
  );
};

export default LikeDislike;
