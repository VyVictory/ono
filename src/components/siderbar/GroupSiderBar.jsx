import React, { useState, useEffect, useRef } from "react";
import { getFriendsMess } from "../../service/friend";
import { useNavigate } from "react-router-dom"; // Import for navigation
import UserStatusIndicator from "../UserStatusIndicator";
import getTimeAgo from "../GetTimeAgo";
import { ButtonBase, Paper } from "@mui/material";
import { useSocketContext } from "../context/socketProvider";
import LoadingAnimation from "../LoadingAnimation";

const GroupSiderBar = () => {
  const [friends, setFriends] = useState([]);
  const [listChat, setListChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const limitCount = 8; // Luôn lấy 8 người mỗi lần
  const [hasMore, setHasMore] = useState(false);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const fetchFriends = async (startIndex, limitCount, name) => {
    if (startIndex === 0) setLoading(true);
    else setLoadingAdd(true);

    try {
      const response = await getFriendsMess(startIndex, limitCount, name);

      if (startIndex === 0) {
        setFriends(response.data.friends);
      } else {
        setFriends((prev) => [...prev, ...response.data.friends]);
      }

      setListChat(response.data);
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
      setLoadingAdd(false);
    }
  };

  useEffect(() => {
    fetchFriends(0, limitCount, name);
  }, [name]);

  const handleSeeMore = () => {
    const newStartIndex = startIndex + limitCount;
    setStartIndex(newStartIndex);
    fetchFriends(newStartIndex, limitCount, name);
  };

  const handleLinkToMess = (chane, id) => {
    const chaneInbox = chane === "group" ? "group?idGroup" : "inbox?idUser";
    navigate(`/messages/${chaneInbox}=${id}`);
  };

  return (
    <>
      <strong className="text-center mt-2 pb-2  w-full ">Cộng đồng</strong>
      <div className="w-full border-t mt-2"></div>
      {loading ? (
        <LoadingAnimation />
      ) : (
        <>
          {friends.map((friend) => (
            <ButtonBase
              onClick={() => handleLinkToMess("inbox", friend?._id)}
              key={friend._id}
              className="hover:bg-gray-200 w-full"
            >
              <div className="w-full flex items-center space-x-2 p-2 border-b border-gray-100 min-h-10">
                <div className="h-8 w-8">
                  <UserStatusIndicator userId={friend?._id} userData={friend} />
                </div>
                <strong className="font-medium text-start text-xs">
                  {friend.firstName} {friend.lastName}
                </strong>
              </div>
            </ButtonBase>
          ))}

          {/* Nút "Xem thêm" */}
          {hasMore && (
            <button
              onClick={handleSeeMore}
              className="w-full py-2 mt-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-600"
              disabled={loadingAdd}
            >
              {loadingAdd ? "Đang tải thêm..." : "Xem thêm"}
            </button>
          )}
        </>
      )}
    </>
  );
};
export default GroupSiderBar;
