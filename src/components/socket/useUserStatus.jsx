import { useEffect, useState } from "react";
import socketConfig from "../../service/socket/socketConfig";
const useUserStatus = (userId) => {
  const [userStatus, setUserStatus] = useState({});

  useEffect(() => {
    if (!socketConfig || !userId) return;
    const handleUpdateUserStatus = ({ users }) => {
    //   console.log("🔄 Received status update:", users);
      setUserStatus((prev) => {
        let isUpdated = false;
        const updated = { ...prev };

        users.forEach((user) => {
          if (updated[user._id] !== user.status) {
            updated[user._id] = user.status;
            isUpdated = true; // Chỉ cập nhật nếu có thay đổi
          }
        });
        return isUpdated ? updated : prev; // Không cập nhật nếu không có thay đổi
      });
    };
    socketConfig.emit("requestUserStatus", [userId]); // Gửi yêu cầu chỉ một lần
    socketConfig.on("updateUserStatus", handleUpdateUserStatus);
    return () => {
      socketConfig.off("updateUserStatus", handleUpdateUserStatus);
    };
  }, [userId]); // Xóa `socketConfig` khỏi dependency để tránh re-run

  return userStatus[userId] ?? false; // Mặc định offline nếu chưa có dữ liệu
};

export default useUserStatus;
