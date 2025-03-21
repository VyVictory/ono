import { Avatar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import avt from "../img/DefaultAvatar.jpg";
import useUserStatus from "./socket/useUserStatus";

const UserStatusIndicator = ({ userId, userData }) => {
  const isOnline = useUserStatus(userId);

  // console.log(`User ${userId} is online:`, isOnline); // ✅ Kiểm tra log đã đúng chưa

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isOnline ? "#44b700" : "#707070",
      color: isOnline ? "#44b700" : "#707070",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    },
  }));

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      <Button
        sx={{
          borderRadius: "50%",
          padding: 0,
          minWidth: "unset",
          width: 40,
          height: 40,
        }}
      >
        <Avatar
          alt="User Avatar"
          src={userData?.avatar || avt}
          sx={{ width: 40, height: 40 }}
        />
      </Button>
    </StyledBadge>
  );
};

export default UserStatusIndicator;
