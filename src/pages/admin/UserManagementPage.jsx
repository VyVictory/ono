import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Button,
  Modal,
  Paper,
  TextField,
  Avatar,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../../service/auth";
import {
  deleteUser,
  getAllUser,
  toogleBan,
  updateUser,
} from "../../service/admin";
import Pagination from "@mui/material/Pagination";
import { useDashboard } from "../../components/context/DashboardProvider";
import UserStatusIndicator from "../../components/UserStatusIndicator";
import { useConfirm } from "../../components/context/ConfirmProvider";
import LoadingAnimation from "../../components/LoadingAnimation";

const genderOptions = ["Male", "Female", "Other"];

export default function UserManagementPage() {
  const { searchTerm, setSearchTerm } = useDashboard();
  const confirm = useConfirm();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down("sm"));
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [isUpdate, setIsUpdate] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUser({ page, limit, search: searchTerm });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };
  const handleView = (user) => {
    setSelectedUser(user);
    setFormData(user);
    setEditMode(false);
    setOpenModal(true);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSave = async () => {
    setIsUpdate(false);
    try {
      const formDataToSend = formData; // Already prepared in the state

      const res = await updateUser(formData._id, formDataToSend); // Pass userId and data
      setIsUpdate(true);
      setOpenModal(false);
      fetchUsers();
    } catch (err) {
      console.error("Failed to update user", err);
    }
  };

  const handleBan = async (id) => {
    try {
      await toogleBan(id);
      fetchUsers();
    } catch (err) {
      console.error("Failed to ban user", err);
    }
  };

  const handleUnban = async (id) => {
    try {
      await toogleBan(id);
      fetchUsers();
    } catch (err) {
      console.error("Failed to unban user", err);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = await confirm(
      "Bạn có chắc muốn xóa người dùng này không?"
    );
    if (!isConfirmed) return;
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
    }
  };

  return (
    <Box sx={{ padding:{xs:2 , md:6}  }}>
      <Typography variant="h5" mb={2}>
        Quản lý người dùng
      </Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Họ tên</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Email</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <div className="flex flex-row items-center justify-start">
                    <div className="w-10 h-10 rounded-full relative">
                      <UserStatusIndicator
                        userId={user?._id}
                        userData={user}
                        // onlineUsers={onlineUsers}
                      />
                    </div>

                    <div className="ml-2 text-start flex-1">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </TableCell>

                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{user.email}</TableCell>
                <TableCell>{user.banned ? "Bị cấm" : "Hoạt động"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleView(user)}>
                    <VisibilityIcon color="primary" />
                  </IconButton>
                  {/* <IconButton onClick={() => handleEdit(user)}>
                    <EditIcon color="info" />
                  </IconButton> */}
                  {user.banned ? (
                    <IconButton onClick={() => handleUnban(user._id)}>
                      <CheckCircleIcon color="success" />
                    </IconButton>
                  ) : (
                    <IconButton onClick={() => handleBan(user._id)}>
                      <BlockIcon color="warning" />
                    </IconButton>
                  )}
                  <IconButton onClick={() => handleDelete(user._id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>{" "}
        <Box sx={{ padding: "10px" }} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Paper>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90dvh",
            overflowY: "auto",
            width: 500,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editMode ? "Chỉnh sửa người dùng" : "Thông tin chi tiết"}
          </Typography>
          {selectedUser && (
            <>
              <Box display="flex" alignItems="center" mb={2}>
                <div className="w-10 h-10 rounded-full relative mr-2">
                  <UserStatusIndicator
                    userId={selectedUser?._id}
                    userData={selectedUser}
                    // onlineUsers={onlineUsers}
                  />
                </div>
                <Typography>{selectedUser.email}</Typography>
              </Box>

              {editMode ? (
                <>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Họ"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Tên"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Số điện thoại"
                    name="phoneNumber"
                    value={formData.phoneNumber || ""}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Giới tính"
                    name="gender"
                    select
                    value={formData.gender || ""}
                    onChange={handleChange}
                  >
                    {genderOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Ngày sinh"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate?.split("T")[0] || ""}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    margin="dense"
                    label="Quốc gia"
                    name="address.country"
                    value={formData.address?.country || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          country: e.target.value,
                        },
                      }))
                    }
                  />
                  {/* <TextField
                    fullWidth
                    margin="dense"
                    label="Chức danh"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    label="Trình độ học vấn"
                    name="education"
                    value={formData.education || ""}
                    onChange={handleChange}
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    label="Phường"
                    name="address.ward"
                    value={formData.address?.ward || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          ward: e.target.value,
                        },
                      }))
                    }
                  />

                  <TextField
                    fullWidth
                    margin="dense"
                    label="Quận"
                    name="address.district"
                    value={formData.address?.district || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: {
                          ...prev.address,
                          district: e.target.value,
                        },
                      }))
                    }
                  /> */}

                  {/* File inputs for avatar and cover photo */}
                  <Box display="flex" flexDirection="column" mt={2}>
                    <Button
                      variant="contained"
                      component="label"
                      size="small"
                      sx={{ mb: 1 }}
                    >
                      Upload Avatar
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            avatar: e.target.files[0],
                          }))
                        }
                      />
                    </Button>

                    <Button variant="contained" component="label" size="small">
                      Upload Cover Photo
                      <input
                        type="file"
                        name="coverPhoto"
                        accept="image/*"
                        hidden
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            coverPhoto: e.target.files[0],
                          }))
                        }
                      />
                    </Button>
                  </Box>

                  <Box mt={2} textAlign="right">
                    {!isUpdate ? (
                      <LoadingAnimation />
                    ) : (
                      <>
                        <Button onClick={() => setOpenModal(false)}>Hủy</Button>
                        <Button
                          onClick={handleSave}
                          variant="contained"
                          sx={{ ml: 2 }}
                        >
                          Lưu
                        </Button>
                      </>
                    )}
                  </Box>
                </>
              ) : (
                <>
                  <Typography>
                    <strong>Họ tên:</strong> {selectedUser.firstName}{" "}
                    {selectedUser.lastName}
                  </Typography>
                  <Typography>
                    <strong>Giới tính:</strong> {selectedUser.gender}
                  </Typography>
                  <Typography>
                    <strong>Ngày sinh:</strong>{" "}
                    {new Date(selectedUser.birthDate).toLocaleDateString()}
                  </Typography>
                  <Typography>
                    <strong>SĐT:</strong>{" "}
                    {selectedUser.phoneNumber || "Không có"}
                  </Typography>
                  <Typography>
                    <strong>Quốc gia:</strong>{" "}
                    {selectedUser.address?.country || "Không có"}
                  </Typography>
                  <Typography>
                    <strong>Trạng thái:</strong>{" "}
                    {selectedUser.banned ? "Bị cấm" : "Hoạt động"}
                  </Typography>
                  <Typography>
                    <strong>Ngày tạo:</strong>{" "}
                    {new Date(selectedUser.createdAt).toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Provider:</strong> {selectedUser.authProvider}
                  </Typography>
                  <Box mt={2} textAlign="right">
                    <Button
                      onClick={() => setEditMode(true)}
                      variant="contained"
                    >
                      Chỉnh sửa
                    </Button>
                  </Box>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
