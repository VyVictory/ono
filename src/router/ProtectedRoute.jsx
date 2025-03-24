import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../components/context/AuthProvider";

const ProtectedRoute = () => {
  const { profile, isLoadingProfile } = useAuth(); // Kiểm tra xem user có đăng nhập không

  if (!profile && isLoadingProfile == false) {
    return <Navigate to="/login" replace />; // Chuyển hướng đến trang login
  }

  return <Outlet />; // Hiển thị nội dung bên trong nếu đã đăng nhập
};

export default ProtectedRoute;
