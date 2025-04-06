import Profile from "../pages/profile/profile";
import { ProfileProvider } from "../components/context/profile/ProfileProvider";
import { useAuth } from "../components/context/AuthProvider";
const ProfileLayout = () => {
  return <Profile />;
};
export default ProfileLayout;
