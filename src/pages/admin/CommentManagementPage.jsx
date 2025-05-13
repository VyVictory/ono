import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Avatar,
  CircularProgress,
  Pagination,
} from "@mui/material";
import {
  Delete,
  DetailsSharp,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { getAllCmt } from "../../service/admin";
import api from "../../service/components/api";
import { useDashboard } from "../../components/context/DashboardProvider";
import { deleteCmt, hiddenCmt } from "../../service/cmt";
import { useModule } from "../../components/context/Module";

export const CommentManagementPage = () => {
  const { searchTerm } = useDashboard();
  const { setCmtVisible, setPostId } = useModule();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCmt } = useModule();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchComments = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await getAllCmt({ page, limit, search });
      if (res) {
        setComments(res.data || []);
        setCurrentPage(res.currentPage || 1);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Lỗi khi lấy bình luận:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchComments(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchCmt]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này?")) {
      try {
        await deleteCmt(id);
        setComments((prev) => prev.filter((cmt) => cmt._id !== id));
      } catch (err) {
        console.error("Xóa thất bại:", err);
      }
    }
  };

  const handleToggleVisibility = async (id, currentVisible) => {
    try {
      await hiddenCmt(id);
      setComments((prev) =>
        prev.map((cmt) =>
          cmt._id === id ? { ...cmt, visible: !currentVisible } : cmt
        )
      );
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
    }
  };

  return (
    <div className="p-6 md:px-52 px-4">
      <Typography variant="h5" className="mb-4 font-bold">
        Quản lý bình luận
      </Typography>

      {loading ? (
        <div className="flex justify-center mt-10">
          <CircularProgress />
        </div>
      ) : comments.length === 0 ? (
        <Typography className="text-gray-500">
          Không có bình luận nào.
        </Typography>
      ) : (
        <>
          <div className="grid gap-4">
            {comments.map((cmt) => (
              <Card key={cmt._id} className="shadow-md">
                <CardContent className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <Avatar src={cmt.author?.avatar} />
                    <div>
                      <Typography className="font-semibold">
                        {cmt.author?.firstName} {cmt.author?.lastName}
                      </Typography>
                      <Typography className="text-sm text-gray-600">
                        {new Date(cmt.createdAt).toLocaleString()}
                      </Typography>
                      <Typography className="mt-2">
                        {cmt.content || "[Không có nội dung]"}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Tooltip title="xem bình luận gốc">
                      <IconButton
                        onClick={() => {
                          setCmtVisible(cmt?._id);
                          setPostId(cmt?.post?._id);
                        }}
                      >
                        <DetailsSharp />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={cmt.visible ? "Ẩn bình luận" : "Hiện bình luận"}
                    >
                      <IconButton
                        onClick={() =>
                          handleToggleVisibility(cmt._id, cmt.visible)
                        }
                      >
                        {cmt.visible ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa bình luận">
                      <IconButton
                        onClick={() => handleDelete(cmt._id)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, value) => setCurrentPage(value)}
              color="primary"
            />
          </div>
        </>
      )}
    </div>
  );
};
