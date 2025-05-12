import React from "react";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  InputBase,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import ArticleIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";
import ReportIcon from "@mui/icons-material/Report";
import { useAuth } from "../components/context/AuthProvider";
import { Outlet, useNavigate } from "react-router-dom";
import UserDropDow from "../components/UserDropDow";
import logo from "../img/logo.gif";
import {
  useDashboard,
} from "../components/context/DashboardProvider";
import { FaSearchLocation } from "react-icons/fa";
const drawerWidth = 240;

const navItems = [
  {
    text: "Quản lý người dùng",
    icon: <PeopleIcon />,
    path: "/dashboard/users",
  },
  { text: "Quản lý bài viết", icon: <ArticleIcon />, path: "/dashboard/posts" },
  {
    text: "Quản lý bình luận",
    icon: <CommentIcon />,
    path: "/dashboard/comments",
  },
  { text: "Quản lý báo cáo", icon: <ReportIcon />, path: "/dashboard/reports" },
];

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { searchTerm, setSearchTerm } = useDashboard();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar sx={{ justifyContent: "start", py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box component="img" src={logo} alt="Logo" sx={{ height: 40 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{ color: "#1976d2", fontWeight: 600 }}
          >
            O NO Admin
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            className="cursor-pointer"
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (

      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            backgroundColor: "#ffffff",
            color: "#000",
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Paper
                component="form"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: 300,
                  height: 40,
                  px: 2,
                  borderRadius: 5,
                  backgroundColor: "#f1f3f4",
                }}
                elevation={0}
                onSubmit={(e) => e.preventDefault()}
              >
                <FaSearchLocation sx={{ color: "gray", mr: 1 }} />
                <InputBase
                  placeholder="Tìm kiếm..."
                  className="pl-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  fullWidth
                  sx={{ fontSize: 14 }}
                />
              </Paper>
            </Box>
            {profile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body1" className="text-nowrap">
                  {profile.firstName} {profile.lastName}
                </Typography>
                <UserDropDow avt={profile?.avt} />
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>

          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "#f9f9f9",
            minHeight: "100vh",
            width: { sm: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
  );
}
