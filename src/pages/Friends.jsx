import React, { useState, useEffect } from "react";
import { getFriendsMess } from "../service/friend";
import { useNavigate } from "react-router-dom"; // Import for navigation
import UserStatusIndicator from "../components/UserStatusIndicator";
import { ButtonBase, Paper, TextField } from "@mui/material"; // Added TextField for search input

import SearchIcon from "@mui/icons-material/Search";

import LoadingAnimation from "../components/LoadingAnimation";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import useUserStatus from "../components/socket/useUserStatus";
import UserStatusOnlineArray from "../components/UserStatusOnlineArray";
const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [listChat, setListChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const limitCount = 8; // Always fetch 8 friends each time
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState(false);
  const [name, setName] = useState(""); // Updated to default empty string
  const navigate = useNavigate();
  const userStatus = UserStatusOnlineArray(); // userStatus là { userId1: true, userId2: false, ... }

  const fetchFriends = async (startIndex, limitCount, name) => {
    if (startIndex === 0) setLoading(true);
    else setLoadingAdd(true);

    try {
      const response = await getFriendsMess(startIndex, limitCount, name);
      let friendsList = response.data.friends;
      // Sắp xếp: những người online (isUserOnline(user._id) === true) lên đầu

      console.log("sau do", friendsList);
      if (startIndex === 0) {
        setFriends(friendsList);
      } else {
        setFriends((prev) => [...prev, ...friendsList]);
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
  friends.sort((a, b) => {
    const onlineA = userStatus[a._id] ? 1 : 0;
    const onlineB = userStatus[b._id] ? 1 : 0;
    return onlineB - onlineA;
  });
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

  // Handle search input change
  const handleSearchChange = (event) => {
    setName(event.target.value);
  };
  const handleChaneSearch = () => {
    setSearch(!search);
  };

  return (
    <div className="flex flex-col items-center h-screen overflow-auto relative">
      <div className="max-w-[800px] px-4  space-y-3 h-full w-full bg-white ">
        <div className="   flex flex-col  sticky top-0  z-10 bg-white">
          <div className="flex relative">
            <strong className="text-center mt-2 pb-2  w-full uppercase text-blue-500">
              Danh sách bạn bè
            </strong>
            <div className="absolute right-0 h-full w-6 flex items-center justify-center mr-2">
              <div
                onClick={handleChaneSearch}
                className="cursor-pointer hover:scale-110 duration-200 hover:text-violet-600"
              >
                {!search ? (
                  <SearchIcon className="w-full aspect-square rounded-lg" />
                ) : (
                  <ArrowUpTrayIcon className="w-full aspect-square rounded-lg" />
                )}
              </div>
            </div>{" "}
          </div>
          {search && (
            <div className="w-full mb-2 mt-2">
              <TextField
                label="Tìm kiếm bạn bè"
                variant="outlined"
                fullWidth
                value={name}
                onChange={handleSearchChange}
                className="mb-2"
                InputLabelProps={{
                  shrink: true, // Keeps the label always on top
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    padding: "6px 14px", // reduced padding for shorter input
                  },
                }}
              />
            </div>
          )}{" "}
          <div className="w-full border-t mt-2"></div>
        </div>
        {/* Search input field */}

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
                  <div className="h-12 w-12">
                    <UserStatusIndicator
                      userId={friend?._id}
                      userData={friend}
                    />
                  </div>
                  <strong className="font-medium text-start text-xl">
                    {friend.firstName} {friend.lastName}
                  </strong>
                </div>
              </ButtonBase>
            ))}

            {/* "See more" button */}
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
      </div>
    </div>
  );
};

export default Friends;
