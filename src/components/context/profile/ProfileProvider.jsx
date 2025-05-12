import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getCurrentUser } from "../../../service/user";
import { useAuth } from "../AuthProvider";
import { useSocketContext } from "../socketProvider";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const location = useLocation();
  const { profile: authProfile, isLoadingProfile } = useAuth();
  const { loadProfile, setLoadProfile } = useSocketContext();

  const [content, setContent] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [profileRender, setProfileRender] = useState({
    myProfile: true,
    profile: null,
  });
  const [loading, setLoading] = useState(true);

  // Update content based on URL path
  useEffect(() => {
    const parts = location.pathname.split("/");
    setContent(parts.length > 2 ? parts[2] : null);
  }, [location.pathname]);

  // Extract user ID from query string whenever location.search changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get("id");
    setIdUser(idParam ?? authProfile?._id);
  }, [location.search, authProfile]);

  // Fetch profile when idUser changes (and after authProfile loads)
  useEffect(() => {
    if (isLoadingProfile || !idUser) return;
    fetchProfile();
  }, [idUser, isLoadingProfile, loadProfile]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // If viewing own profile, use authProfile
      if (idUser === authProfile?._id) {
        setCurrentUser(authProfile);
        setProfileRender({ myProfile: true, profile: authProfile });
      } else {
        // Fetch other user's profile
        const response = await getCurrentUser(idUser);
        setCurrentUser(response?.data);
        setProfileRender({ myProfile: false, profile: response?.data });
      }
      // If using sockets to load profile updates:
      if (loadProfile) {
        setLoadProfile(false);
      }
    } catch (error) {
      console.error("Get Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };
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
