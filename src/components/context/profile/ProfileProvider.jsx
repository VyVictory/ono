import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Nếu dùng React Router
import { getCurrentUser } from "../../../service/user";
import { useAuth } from "../AuthProvider";
const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const location = useLocation(); // Lấy URL hiện tại
  const [idUser, setIdUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileRender, setProfileRender] = useState(null);
  const { isLoadingProfile, profile } = useAuth();
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  useEffect(() => {
    if (id) {
      setIdUser(id);
    } else {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    const parts = location.pathname.split("/"); // Tách URL thành mảng
    setContent(parts.length > 2 ? parts[2] : null); // Gán content nếu có
  }, [location.pathname]); // Chạy lại khi URL thay đổi

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCurrentUser(idUser);
        setLoading(false);
        setCurrentUser(response);
      } catch (error) {
        console.error("Get Profile Error:", error);
      }
    };
    idUser && fetchProfile();
  }, [idUser]);
  useEffect(() => {
    if (currentUser != null && id != null && currentUser._id != profile._id) {
      setProfileRender({ myprofile: false, profile: currentUser });
    } else {
      setProfileRender({ myprofile: true, profile: profile });
    }
  }, [currentUser, isLoadingProfile, id]);
  return (
    <ProfileContext.Provider
      value={{
        content,
        setContent,
        idUser,
        setIdUser,
        loading,
        profileRender,
        setProfileRender,
        setLoading,
        setCurrentUser,
        currentUser,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
