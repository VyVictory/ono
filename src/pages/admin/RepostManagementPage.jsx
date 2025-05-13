import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  Stack,
} from "@mui/material";
import { deleteReport, getReport, resolvedReport } from "../../service/report";
import { toast } from "react-toastify";
import UserStatusIndicator from "../../components/UserStatusIndicator";
import { DetailsOutlined, DetailsTwoTone, Search } from "@mui/icons-material";
import { useModule } from "../../components/context/Module";
import { useConfirm } from "../../components/context/ConfirmProvider";
const targetTypes = [
  { label: "Tất cả", value: "" },
  { label: "Bài viết", value: "post" },
  { label: "Người dùng", value: "user" },
  { label: "Bình luận", value: "comment" },
];

const statusColors = {
  pending: "warning",
  resolved: "success",
  rejected: "default",
};

export const RepostManagementPage = () => {
  const [selectedTarget, setSelectedTarget] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setPostId, setCmtVisible } = useModule();
  const confirm = useConfirm(); // Sửa lại như trong AddFriend

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReport(selectedTarget);
      setReports(res?.data || []);
    } catch (err) {
      toast.error("Lỗi khi tải báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id, type) => {
    const isConfirmed = await confirm("Bạn có chắc muốn xác nhận thực thi?");
    if (!isConfirmed) return;
    try {
      await resolvedReport(id, type);
      toast.success("Đã đánh dấu là đã xử lý.");
      fetchReports();
    } catch {
      toast.error("Lỗi khi xác nhận xử lý.");
    }
  };

  const handleDelete = async (id, type) => {
    const isConfirmed = await confirm("Bạn có chắc muốn xóa tố cáo này?");
    if (!isConfirmed) return;
    try {
      await deleteReport(id, type);
      toast.success("Đã xóa báo cáo.");
      fetchReports();
    } catch {
      toast.error("Lỗi khi xóa báo cáo.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedTarget]);

  const detectTargetType = (report) => {
    if (report.post) return "post";
    if (report.comment) return "comment";
    if (report.reportedUser) return "user";
    return "-";
  };

  const getTargetContent = (report) => {
    if (report.post)
      return (
        (
          <div
            onClick={() => {
              setPostId(report?.post?._id);
            }}
            className="cursor-pointer hover:scale-125"
          >
            <Search className="w-10 aspect-square " />
            Xem
          </div>
        ) || "Không rõ nội dung"
      );
    if (report.comment)
      return (
        (
          <div
            onClick={() => {
              setCmtVisible(report?.comment?._id);
              setPostId(report?.comment?.post);
            }}
            className="cursor-pointer hover:scale-125"
          >
            {" "}
            <Search className="w-10 aspect-square " />
            Xem
          </div>
        ) || "Không rõ nội dung"
      );
    if (report.reportedUser)
      return (
        <div className="text-wrap flex items-center flex-col lg:flex-row">
          <div className="w-10 aspect-square">
            <UserStatusIndicator
              userId={report.reportedUser?._id}
              userData={report.reportedUser}
            />
          </div>
          {report.reportedUser.firstName + " " + report.reportedUser.lastName}
        </div>
      );
    return "Không xác định";
  };

  return (
    <Box className="p-6">
      <Typography variant="h5" className="mb-6 font-semibold">
        Quản Trị Báo Cáo
      </Typography>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          displayEmpty
          className="w-64"
          size="small"
        >
          {targetTypes.map((target) => (
            <MenuItem key={target.value} value={target.value}>
              {target.label}
            </MenuItem>
          ))}
        </Select>

        <Button variant="outlined" onClick={fetchReports}>
          Tải lại
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <CircularProgress />
        </div>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Người Tố Cáo</TableCell>
              <TableCell>Đối Tượng</TableCell>
              <TableCell>Loại Đối Tượng</TableCell>
              <TableCell>Nội Dung</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Ngày Gửi</TableCell>
              <TableCell>Thao Tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Không có báo cáo nào.
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => {
                const targetType = detectTargetType(report);
                return (
                  <TableRow key={report._id}>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <div className="text-wrap flex items-center flex-col lg:flex-row">
                          <div className="w-10 aspect-square">
                            <UserStatusIndicator
                              userId={report.author?._id}
                              userData={report.author}
                            />
                          </div>
                          {report.author
                            ? `${report.author.firstName} ${report.author.lastName}`
                            : "Ẩn danh"}
                        </div>
                      </Stack>
                    </TableCell>

                    <TableCell>{getTargetContent(report)}</TableCell>
                    <TableCell>{targetType}</TableCell>
                    <TableCell>{report.content || "-"}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        color={statusColors[report.status] || "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(report.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {report.status === "pending" && (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            onClick={() =>
                              handleResolve(
                                report._id,
                                report.reportedUser
                                  ? "user"
                                  : report.comment
                                  ? "comment"
                                  : "post"
                              )
                            }
                          >
                            Duyệt
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDelete(
                              report._id,
                              report.reportedUser
                                ? "user"
                                : report.comment
                                ? "comment"
                                : "post"
                            )
                          }
                        >
                          Xóa
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};
