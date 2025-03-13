 
import Profile from "../pages/profile/profile";
import { ProfileProvider } from "../components/context/profile/ProfileProvider";
import { useAuth } from "../components/context/AuthProvider";
const ProfileLayout = () => {
  const { showLogin, setShowLogin, profile, isLoadingProfile } = useAuth();
  return (
    <ProfileProvider>
      <Profile />
    </ProfileProvider>
  );
};
export default ProfileLayout;
