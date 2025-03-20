import React from "react";
import { Avatar } from "@mui/material";
import StyledBadge from "@mui/material/Badge"; // Ensure you have StyledBadge defined or imported
import avtDefault from "../img/DefaultAvatar.jpg";

const AvatarUser = ({ avt, css }) => {
  return (
    <StyledBadge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
    >
      <Avatar
        alt="User Avatar"
        sx={css || { width: 24, height: 24 }}
        src={avt || avtDefault} // Fixed: Using || instead of |
      />
    </StyledBadge>
  );
};

export default AvatarUser;
