import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import Login from "../components/Auth/Login";
const Layout = () => {
  return (
    <div className="relative  min-h-screen">
      <div className="fixed inset-0 bg-gray-100  -z-10"></div>
      <NavBar />
      <Outlet />
    </div>
  );
};
export default Layout;
