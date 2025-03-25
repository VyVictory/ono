import { useState } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  Button,
} from "@mui/material";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { PhotoAlbum } from "@mui/icons-material";
import { editUserImage } from "../../service/user";
import { useAuth } from "../../components/context/AuthProvider";
import { toast } from "react-toastify";
const DropdownChangeImage = () => {
  const { profile, setProfile } = useAuth(); // Lấy dữ liệu user từ AuthProvider
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [changeType, setChangeType] = useState(null); // "avatar" hoặc "coverPhoto"
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);
  const openConfirmDialog = (type) => {
    setChangeType(type);
    setOpenDialog(true);
    closeMenu();
  };
  const closeDialog = () => {
    setOpenDialog(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Vui lòng chọn một file!");
    setLoading(true);

    const formData = new FormData();
    formData.append(changeType, selectedFile); // "avatar" hoặc "coverPhoto"

    try {
      const response = await editUserImage(formData);
      if (response.status === 200) { 
        toast.success("Cập nhật thành công! 🎉");
        // ✅ Cập nhật lại profile trong AuthProvider với dữ liệu mới từ server
        setProfile((prev) => ({
          ...prev,
          avatar: response?.data?.avatar ?? prev.avatar,
          coverPhoto: response?.data?.coverPhoto ?? prev.coverPhoto,
        }));
        console.log(profile);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error); 
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
      closeDialog();
    }
  };

  return (
    <div className="relative inline-block">
      {/* Nút mở dropdown */}
      <IconButton
        onClick={openMenu}
        className="bg-gray-50 hover:bg-violet-50 rounded-md"
      >
        <ChevronDownIcon className="w-8 h-8 text-gray-500 hover:scale-125 hover:text-violet-400" />
      </IconButton>

      {/* Dropdown Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
        <MenuItem onClick={() => openConfirmDialog("coverPhoto")}>
          <PhotoAlbum className="text-violet-500" />
          <span className="ml-2">Đổi ảnh nền</span>
        </MenuItem>
        <MenuItem onClick={() => openConfirmDialog("avatar")}>
          <UserCircleIcon className="w-6 h-6 text-violet-500" />
          <span className="ml-2">Đổi avatar</span>
        </MenuItem>
      </Menu>

      {/* Dialog xác nhận đổi ảnh */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>
          Bạn có chắc muốn thay đổi{" "}
          {changeType === "avatar" ? "avatar" : "ảnh nền"}?
        </DialogTitle>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="p-4"
        />
        <DialogActions>
          <Button onClick={closeDialog} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleUpload}
            color="primary"
            disabled={!selectedFile || loading}
          >
            {loading ? "Đang tải..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DropdownChangeImage;
