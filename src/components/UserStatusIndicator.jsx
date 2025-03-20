import { useEffect, useState } from "react";

const UserStatusIndicator = ({ userId, onlineUsers }) => {
  // Lấy danh sách users từ object onlineUsers (nếu có)
  const [isOnline, setIsOnline] = useState(false);

  // console.log(isOnline);
  useEffect(() => {
    const usersArray = Array.isArray(onlineUsers?.users)
      ? onlineUsers.users
      : [];
    // Kiểm tra user có online không
    setIsOnline(usersArray.some((user) => user._id === userId && user.status)); 
  }, [userId, onlineUsers]);
  return (
    <div
      className={`h-3 w-3 border-2 border-white rounded-full ${
        isOnline ? "bg-green-500" : "bg-gray-400"
      }`}
    ></div>
  );
};

export default UserStatusIndicator;
