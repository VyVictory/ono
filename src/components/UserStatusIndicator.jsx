import { Avatar, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import avt from "../img/DefaultAvatar.jpg";
import useUserStatus from "./socket/useUserStatus";

const UserStatusIndicator = ({ userId, userData, styler = {} }) => {
  const isOnline = useUserStatus(userId);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isOnline ? "#44b700" : "#707070",
      color: isOnline ? "#44b700" : "#707070",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      width: styler?.badge?.size || "8px",
      height: styler?.badge?.size || "8px",
      borderRadius: "100%",
      fontSize: "12px",
      transform: styler?.badge?.translate || "",
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
      <div
        style={{
          borderRadius: "50%",
          padding: 0,
          minWidth: "unset",
          width: styler?.button?.size || "32px", // Giữ tỉ lệ cố định
          height: styler?.button?.size || "32px",
          display: "flex", // Đảm bảo không bị co
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden", // Tránh ảnh bị méo
          cursor: "pointer",
          ...styler?.button,
        }}
      >
        <Avatar
          alt="User Avatar"
          src={userData?.avatar || avt}
          sx={{
            width: "100%",
            height: "100%",
            minWidth: "32px", // Đảm bảo không bị quá nhỏ
            minHeight: "32px",
            display: "block", // Tránh lỗi kích thước không đồng nhất
            objectFit: "cover", // "cover" để giữ ảnh đẹp, "contain" nếu muốn tránh cắt ảnh
            aspectRatio: "1 / 1", // ✅ Giữ tỉ lệ tròn hoàn hảo
            borderRadius: "50%", // ✅ Đảm bảo hình tròn
            ...styler?.avatar,
          }}
        />
      </div>
    </StyledBadge>
  );
};

export default UserStatusIndicator;
