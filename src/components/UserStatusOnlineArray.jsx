import { useEffect, useState } from "react";
import socketConfig from "../service/socket/socketConfig";

const UserStatusOnlineArray = () => {
  const [userStatus, setUserStatus] = useState({});

  useEffect(() => {
    if (!socketConfig) return;

    const handleUpdateUserStatus = ({ users }) => {
      setUserStatus((prev) => {
        let isUpdated = false;
        const updated = { ...prev };

        users.forEach((user) => {
          if (updated[user._id] !== user.status) {
            updated[user._id] = user.status;
            isUpdated = true;
          }
        });
        return isUpdated ? updated : prev;
      });
    };

    socketConfig.emit("requestUserStatus"); // không cần truyền userId
    socketConfig.on("updateUserStatus", handleUpdateUserStatus);

    return () => {
      socketConfig.off("updateUserStatus", handleUpdateUserStatus);
    };
  }, []);

  return userStatus; // trả về tất cả trạng thái
};

export default UserStatusOnlineArray;
