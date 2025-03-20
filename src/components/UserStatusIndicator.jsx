import { useEffect, useState } from "react";
import { Avatar, Button } from "@mui/material";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import avt from "../img/DefaultAvatar.jpg";
const UserStatusIndicator = ({ userId, onlineUsers, userdata }) => {
  const [isOnline, setIsOnline] = useState(false);
  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      backgroundColor: isOnline ? "#44b700" : "#707070",
      color: isOnline ? "#44b700" : "#707070",
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      ...(isOnline && {
        "&::after": {
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
      }),
    },
    "@keyframes ripple": {
      "0%": {
        transform: "scale(.8)",
        opacity: 1,
      },
      "100%": {
        transform: "scale(2.4)",
        opacity: 0,
      },
    },
  }));
  // console.log(isOnline);
  useEffect(() => {
    const usersArray = Array.isArray(onlineUsers?.users)
      ? onlineUsers.users
      : [];
    // Kiểm tra user có online không
    setIsOnline(usersArray.some((user) => user._id === userId && user.status));
  }, [userId, onlineUsers]);
  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      {" "}
      <Button
        sx={{
          borderRadius: "50%",
          padding: 0, // Loại bỏ padding để tránh làm to nút
          minWidth: "unset", // Ngăn Material-UI tự động đặt width tối thiểu
          width: 40, // Đặt cùng kích thước với Avatar
          height: 40,
        }}
      >
        <Avatar
          alt="Remy Sharp"
          src={userdata?.avatar || avt}
          sx={{ width: 40, height: 40 }}
        />
      </Button>
    </StyledBadge>
  );
};

export default UserStatusIndicator;
