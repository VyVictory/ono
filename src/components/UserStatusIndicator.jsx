import { Avatar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import avt from "../img/DefaultAvatar.jpg";
import useUserStatus from "./socket/useUserStatus";
const UserStatusIndicator = ({ userId, userData, styler }) => {
  const isOnline = useUserStatus(userId);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isOnline ? "#44b700" : "#707070",
      color: isOnline ? "#44b700" : "#707070",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      width: styler?.badge?.size || "8px", // ✅ Tăng kích thước badge
      height: styler?.badge?.size || "8px",
      borderRadius: "100%",
      fontSize: "12px",
      "&::after": isOnline && {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animation: "ripple 1.2s infinite ease-in-out",
        border: "1px solid currentColor",
        content: '""',
      },
    },
    "@keyframes ripple": {
      "0%": { transform: "scale(.8)", opacity: 1 },
      "100%": { transform: "scale(2.4)", opacity: 0 },
    },
  }));

  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      sx={styler?.badge}
    >
      <Button
        sx={{
          borderRadius: "50%",
          padding: 0,
          minWidth: "unset",
          width: "100%", // ✅ Kế thừa kích thước từ ngoài
          height: "100%", // ✅ Kế thừa kích thước từ ngoài
          ...styler?.button,
        }}
      >
        <Avatar
          alt="User Avatar"
          src={userData?.avatar || avt}
          sx={{
            width: "100%", // ✅ Avatar bằng đúng button
            height: "100%", // ✅ Avatar bằng đúng button
            objectFit: "cover",
            ...styler?.avatar,
          }}
        />
      </Button>
    </StyledBadge>
  );
};


export default UserStatusIndicator;
