import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import { Link, useLocation } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Danh sách menu từ "Nhóm" trở đi
const menuItems = [
  { name: "Nhóm", link: "/profile/groups", icon: "📌" },
  { name: "Videos", link: "/profile/videos", icon: "🎥" },
];

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    transformOrigin={{ vertical: "top", horizontal: "right" }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export default function CustomizedMenus({ css }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const location = useLocation(); // Lấy đường dẫn URL hiện tại
  return (
    <div className={`${css} py-2 `}>
      <button
        onClick={handleClick}
        className="hover:bg-gray-100 p-3 rounded-xl flex items-center w-full"
      >
        More <KeyboardArrowDownIcon className="w-5 h-5 ml-1" />
      </button>
      <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.link;
          return (
            <MenuItem
              className=""
              key={index}
              onClick={handleClose}
              disableRipple
            >
              <span className="mr-2">{item.icon}</span>
              <Link
                to={item.link} // Use Link instead of <a> for client-side navigation
                className={`${isActive ? "text-blue-800" : "text-gray-800"}`}
              >
                {item.name}
              </Link>
            </MenuItem>
          );
        })}
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleClose} disableRipple>
          <span className="mr-2">✏️</span> Edit
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
