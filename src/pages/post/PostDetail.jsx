import { useEffect, useState } from "react";
import Post from "./Post";
import { useModule } from "../../components/context/Module";
import { getPostById } from "../../service/post";
import { X } from "@mui/icons-material";
export const PostDetail = ({ PostId }) => {
  const { postId, setPostId } = useModule();
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);

  const id = PostId || postId;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await getPostById(id); 
        setPostData(res);
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  const handleClose = () => {
    setPostId(null); // Tắt modal
  };

  if (!id) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
      onClick={handleClose}
    >
      {" "}
      <button
        onClick={handleClose}
        className="absolute top-1 right-1 p-2 text-gray-500 hover:text-black transition"
        aria-label="Đóng"
      >
        <X className="w-6 h-6" />
      </button>
      <div
        className="bg-white shadow-lg h-[100vh] overflow-y-auto w-full p-4 lg:p-12 pt-12 lg:pt-4"
        onClick={(e) => e.stopPropagation()} // Ngăn chặn tắt khi click vào trong
      >
        {loading ? (
          <div className="text-center text-gray-600">Đang tải bài viết...</div>
        ) : postData ? (
          <Post data={{ posts: [postData] }} />
        ) : (
          <div className="text-center text-red-500">
            Không tìm thấy bài viết.
          </div>
        )}
      </div>
    </div>
  );
};
