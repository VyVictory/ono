import { useState, useEffect } from "react";
import { useConfirm } from "../../components/context/ConfirmProvider";
import { toast } from "react-toastify";
import { checkFollow, follow, unFollow } from "../../service/follow"; // ✅ Kiểm tra lại import này
import { Box } from "@mui/material";
import { FavoriteBorder, Add, Remove } from "@mui/icons-material";

const AddFollow = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [statusFollow, setStatusFollow] = useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    const renderStatus = async () => {
      if (!profile?._id) return;
      setLoading(true);
      try {
        const res = await checkFollow(profile._id);
        if (res.status == 200) {
          console.log(res?.data?.following);
          setStatusFollow(res?.data?.following);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra follow:", error);
      }
      setLoading(false);
    };
    renderStatus();
  }, [profile]);

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (!statusFollow) {
        await handleFollowAction();
      } else {
        await handleUnfollowAction();
      }
    } catch (error) {
      console.error("Lỗi khi xử lý follow/unfollow:", error);
    }
    setLoading(false);
  };

  const notification = (res) => {
    if (!res || res.status !== 200) {
      toast.error(res?.data?.message || "Lỗi không xác định.", {
        autoClose: 500,
      });
    } else {
      toast.success(res.data.message || "Thành công!", { autoClose: 500 });
    }
  };

  const handleFollowAction = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn follow?");
    if (!isConfirmed) return;
    try {
      const res = await follow(profile._id);
      notification(res);
      if (res.status === 200) setStatusFollow(true);
    } catch (error) {
      notification(0);
      console.error("Lỗi khi follow:", error);
    }
  };

  const handleUnfollowAction = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn hủy follow?");
    if (!isConfirmed) return;
    try {
      const res = await unFollow(profile._id); // ✅ Đảm bảo bạn import đúng
      notification(res);
      if (res.status === 200) setStatusFollow(false);
    } catch (error) {
      notification(0);
      console.error("Lỗi khi unfollow:", error);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className="bg-gray-50 px-2 py-2 rounded-md flex items-center transition-transform duration-200"
    >
      <Box display="flex" gap={2}>
        <Box position="relative" display="inline-block">
          <FavoriteBorder fontSize="large" color="error" />
          {statusFollow ? (
            <Remove
              fontSize="small"
              color="secondary"
              sx={{
                position: "absolute",
                bottom: 0,
                right: -5,
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            />
          ) : (
            <Add
              fontSize="small"
              color="primary"
              sx={{
                position: "absolute",
                bottom: 0,
                right: -5,
                backgroundColor: "white",
                borderRadius: "50%",
              }}
            />
          )}
        </Box>
      </Box>
    </button>
  );
};

export default AddFollow;
