import React, { createContext, useContext, useState, useEffect } from "react";
import { getProfile } from "../../service/user";
import authToken from "../../service/storage/authToken";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true); // 🟢 Thêm trạng thái loading

  // Hàm gọi API để lấy thông tin người dùng
  const fetchProfile = async () => {
    try {
      const userData = await getProfile();
      console.log("Profilee:", userData);
      setProfile(userData);
    } catch (error) {
      // console.error("Fetch profile failed err:", error);
    } finally {
      setIsLoadingProfile(false); // 🟢 Đánh dấu đã load xong
    }
  };

  // Lấy thông tin người dùng ngay khi component mount
  useEffect(() => {
    const token = authToken.getToken();
    if (token) {
      fetchProfile();
    } else {
      setIsLoadingProfile(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        showLogin,
        setShowLogin,
        profile,
        setProfile,
        isLoadingProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
