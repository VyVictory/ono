import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdatePostForm from "../../components/UpdatePostModal";
import { useModule } from "../../components/context/Module";
import { Details } from "@mui/icons-material";
import { useAuth } from "../../components/context/AuthProvider";
import { deletePost } from "../../service/post";
import { useConfirm } from "../../components/context/ConfirmProvider";
import { FlagIcon } from "@heroicons/react/24/outline";
export default function MenuPost({ data, setPosts }) {
  const { profile } = useAuth();
  const confirm = useConfirm(); // Sửa lại như trong AddFriend

  const { updatePost, setUpdatePost, postId, setPostId, setReport } =
    useModule();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);
  const onEdit = () => {
    setUpdatePost(data._id);
  };
  const onDelete = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn xóa bài viết này?");
    if (!isConfirmed) return;

    try {
      await deletePost(data._id);
      // Sau khi xóa thành công, loại bỏ post khỏi danh sách
      setPosts((prev) => prev.filter((p) => p._id !== data._id));
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {" "}
        <MenuItem
          onClick={() => {
            handleClose();
            setPostId(data._id);
          }}
        >
          <Details fontSize="small" sx={{ mr: 1, color: "gray" }} />
          Xem chi tiết
        </MenuItem>{" "}
        <MenuItem
          onClick={() => {
            handleClose();
            if (data?._id) {
              setReport({ postId: data?._id });
            }
          }}
        >
          <FlagIcon
            fontSize="small"
            className="text-red-500 w-4 mr-2 aspect-square"
          />
          Tố cáo
        </MenuItem>{" "}
        {(data?.author?._id === profile?._id || profile?.role == 1) && (
          <>
            {" "}
            <MenuItem
              onClick={() => {
                handleClose();
                onEdit();
              }}
            >
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Chỉnh sửa
            </MenuItem>{" "}
            <MenuItem
              onClick={() => {
                handleClose();
                onDelete();
              }}
            >
              <DeleteIcon fontSize="small" sx={{ mr: 1, color: "red" }} />
              Xóa
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}
