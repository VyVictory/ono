import { useState, useEffect } from "react";
import {
  XMarkIcon,
  UserMinusIcon,
  UserPlusIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import {
  acceptedAddFriend,
  addFriend,
  cancelFriendRequest,
  rejectedAddFriend,
  unFriend,
} from "../service/friend";
import { useConfirm } from "./context/ConfirmProvider";
import { toast } from "react-toastify";
const AddFriend = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const confirm = useConfirm(); // Sửa lại như trong AddFriend

  const [friendStatus, setFriendStatus] = useState(profile.friendStatus); // ✅ Thêm state lưu trạng thái

  useEffect(() => {
    setLoading(true);
    setFriendStatus(profile.friendStatus);
    setLoading(false);
  }, [profile]);
  const handleAddFriend = async (status) => {
    if (loading) return;
    setLoading(true);

    switch (status) {
      case "waiting": // bạn gửi cho đối phương
        await cancelRequest();
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
      default:
        await adFriend();
        break;
    }

    setLoading(false);
  };
  const notification = (res) => {
    if (res == 0) {
      return toast.error("ôi không lỗi gì đó rồi", {
        autoClose: 500,
      });
    }
    if (res.status == 200) {
      toast.success(res.data.message || "thành công.", {
        autoClose: 500,
      });
    } else {
      toast.error(res.data.message || "thất bại.", {
        autoClose: 500,
      });
    }
  };
  const adFriend = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn gửi yêu cầu kết bạn?");
    if (!isConfirmed) return;
    try {
      console.log("Đang gửi yêu cầu kết bạn ID:", profile._id);
      notification(await addFriend(profile._id));
    } catch (error) {
      notification(0);
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
    } finally {
      setFriendStatus("waiting"); // ✅ Cập nhật state thay vì thay đổi trực tiếp profile
    }
  };

  const acceptedFriend = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn đồng ý kết bạn?");
    if (!isConfirmed) return;
    try {
      notification(await acceptedAddFriend(profile._id));
    } catch (error) {
      notification(0);
      console.error("Lỗi khi đồng ý kết bạn:", error);
    } finally {
      setFriendStatus("accepted"); // ✅ Cập nhật state
    }
  };

  const rejectedFriend = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn từ chối kết bạn?");
    if (!isConfirmed) return;
    try {
      notification(await rejectedAddFriend(profile._id));
    } catch (error) {
      notification(0);
      console.error("Lỗi khi từ chối kết bạn:", error);
    } finally {
      setFriendStatus("noFriend"); // ✅ Cập nhật state
    }
  };

  const cancelRequest = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn hủy yêu cầu kết bạn?");
    if (!isConfirmed) return;
    try {
      notification(await cancelFriendRequest(profile._id));
    } catch (error) {
      notification(0);
      console.error("Lỗi khi hủy yêu cầu kết bạn:", error);
    } finally {
      setFriendStatus("noFriend"); // ✅ Cập nhật state
    }
  };

  const removeFriend = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn xóa bạn bè?");
    if (!isConfirmed) return;
    try {
      notification(await unFriend(profile._id));
    } catch (error) {
      notification(0);
      console.error("Lỗi khi xóa bạn bè:", error);
    } finally {
      setFriendStatus("noFriend"); // ✅ Cập nhật state
    }
  };

  const statusConfig = {
    waiting: { icon: XMarkIcon, text: "Hủy yêu cầu", color: "text-red-500" },
    pending: {
      icon: CheckIcon,
      text: "Đồng ý kết bạn",
      color: "text-green-500",
    },
    accepted: {
      icon: UserMinusIcon,
      text: "Xóa bạn bè",
      color: "text-red-500",
    },
    noFriend: {
      icon: UserPlusIcon,
      text: "Thêm bạn bè",
      color: "text-green-500",
    },
    blocked: { icon: UserPlusIcon, text: "Bị block", color: "text-gray-500" },
    rejected: {
      icon: UserPlusIcon,
      text: "Gửi lại yêu cầu",
      color: "text-gray-500",
    },
  };
  // console.log(friendStatus);
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
              ? "opacity-50 cursor-not-allowed hidden"
              : "hover:bg-green-50 hover:scale-110"
          }`}
        >
          {Icon && (
            <>
              <XMarkIcon className={`h-6 w-6 text-red-500`} />
              <span className="ml-1 text-red-700">Từ chối</span>
            </>
          )}
        </button>
      )}
    </>
  );
};

export default AddFriend;
