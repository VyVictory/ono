import { useState } from "react";
import {
  XMarkIcon,
  UserMinusIcon,
  UserPlusIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import {
  acceptedAddFriend,
  addFriend,
  rejectedAddFriend,
} from "../service/friend";
import { useConfirm } from "./context/ConfirmProvider";

const AddFriend = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const confirm = useConfirm();
  const [friendStatus, setFriendStatus] = useState(profile.friendStatus); // ✅ Thêm state lưu trạng thái

  const handleAddFriend = async (status) => {
    if (loading) return;
    setLoading(true);

    switch (status) {
      case "waiting": // bạn gửi cho đối phương
        await cancelFriend();
        break;
      case "pending": // chờ bạn đồng ý
        await acceptedFriend();
        break;
      case "blocked": // bị block
        break;
      case "accepted": // đã là bạn bè
        await removeFriend();
        break;
      case "removeRequest": // gửi yêu cầu từ chối
        await rejectedFriend();
        break;
      case "cancelRequest": // gửi yêu cầu từ chối
        await cancelRequest();
        break;
      default:
        await adFriend();
        break;
    }

    setLoading(false);
  };

  const adFriend = async () => {
    try {
      const isConfirmed = await confirm("Bạn có chắc muốn kết bạn?");
      if (!isConfirmed) return;

      console.log("Đang gửi yêu cầu kết bạn ID:", profile._id);
      await addFriend(profile._id);
      setFriendStatus("waiting"); // ✅ Cập nhật state thay vì thay đổi trực tiếp profile
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
    }
  };

  const acceptedFriend = async () => {
    try {
      const isConfirmed = await confirm("Bạn có chắc muốn đồng ý kết bạn?");
      if (!isConfirmed) return;
      await acceptedAddFriend(profile._id);
      setFriendStatus("accepted"); // ✅ Cập nhật state
    } catch (error) {
      console.error("Lỗi khi đồng ý kết bạn:", error);
    }
  };

  const rejectedFriend = async () => {
    try {
      const isConfirmed = await confirm("Bạn có chắc muốn từ chối kết bạn?");
      if (!isConfirmed) return;
      await rejectedAddFriend(profile._id);
      setFriendStatus("noFriend"); // ✅ Cập nhật state
    } catch (error) {
      console.error("Lỗi khi từ chối kết bạn:", error);
    }
  };

  const cancelRequest = async () => {
    try {
      const isConfirmed = await confirm(
        "Bạn có chắc muốn hủy yêu cầu kết bạn?"
      );
      if (!isConfirmed) return;
      await rejectedAddFriend(profile._id);
      setFriendStatus("noFriend"); // ✅ Cập nhật state
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu kết bạn:", error);
    }
  };

  const removeFriend = async () => {
    try {
      const isConfirmed = await confirm("Bạn có chắc muốn xóa bạn bè?");
      if (!isConfirmed) return;
      setFriendStatus("noFriend"); // ✅ Cập nhật state
    } catch (error) {
      console.error("Lỗi khi xóa bạn bè:", error);
    }
  };

  const statusConfig = {
    waiting: { icon: XMarkIcon, text: "Hủy yêu cầu", color: "text-red-500" },
    pending: {
      icon: CheckIcon,
      text: "Đồng ý kết bạn",
      color: "text-green-500",
    },
    accepted: { icon: UserMinusIcon, text: "Unfriend", color: "text-gray-500" },
    noFriend: {
      icon: UserPlusIcon,
      text: "Add Friend",
      color: "text-green-500",
    },
    blocked: { icon: UserPlusIcon, text: "Bị block", color: "text-gray-500" },
    rejected: {
      icon: UserPlusIcon,
      text: "Gửi lại yêu cầu",
      color: "text-gray-500",
    },
  };
  console.log(friendStatus);
  const { icon: Icon, text, color } = statusConfig[friendStatus] || {};

  return (
    <>
      <button
        onClick={() => handleAddFriend(friendStatus)}
        disabled={loading}
        className={`bg-gray-50 px-2 py-2 rounded-md flex items-center transition-transform duration-200 ${
          loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-green-50 hover:scale-110"
        }`}
      >
        {loading ? (
          <svg
            className="animate-spin h-6 w-6 text-gray-500"
            viewBox="0 0 24 24"
          >
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
        ) : (
          Icon && (
            <>
              <Icon className={`h-6 w-6 ${color}`} />
              <span className="ml-1 text-gray-700">{text}</span>
            </>
          )
        )}
      </button>
      {friendStatus == "pending" && (
        <button
          onClick={() => handleAddFriend("removeRequest")}
          disabled={loading}
          className={`bg-gray-50 px-2 py-2 rounded-md flex items-center transition-transform duration-200 ${
            loading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-green-50 hover:scale-110"
          }`}
        >
          {loading ? (
            <svg
              className="animate-spin h-6 w-6 text-gray-500"
              viewBox="0 0 24 24"
            >
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
          ) : (
            Icon && (
              <>
                <XMarkIcon className={`h-6 w-6 text-red-500`} />
                <span className="ml-1 text-red-700">Từ chối</span>
              </>
            )
          )}
        </button>
      )}
    </>
  );
};

export default AddFriend;
