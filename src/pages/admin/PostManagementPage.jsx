import { useEffect, useState } from "react";
import { Button, TextField, Pagination, CircularProgress } from "@mui/material";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/solid";
import Post from "../post/Post";
import { getAllPost } from "../../service/admin";
import { useDashboard } from "../../components/context/DashboardProvider";

export const PostManagementPage = () => {
  const { searchTerm, setSearchTerm } = useDashboard();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  const fetchPosts = async (page = 1, searchText = "") => {
    try {
      setLoading(true);
      const res = await getAllPost({ page, limit, search: searchText });
      if (res) {
        setPosts(res || []);
        setCurrentPage(res.currentPage || 1);
        setTotalPages(res.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPosts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);
  return (
    <div className="p-6 md:px-52 px-4">
      <h2 className="text-2xl font-bold mb-4">Quản lý bài viết</h2>
      <Post data={posts} />
      {loading ? (
        <div className="flex justify-center py-12">
          <CircularProgress />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">Không có bài viết nào.</p>
      ) : (
        <>
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
