import NavBar from "../components/Navbar/NavBar";
import { Outlet } from "react-router-dom";
import Login from "../components/Auth/Login";
import { ConfirmProvider } from "../components/context/ConfirmProvider";

const Layout = () => {
  return (
    <ConfirmProvider>
      <div className="fixed inset-0 bg-gray-100  -z-10"></div>
      <NavBar />
      <Outlet />
    </ConfirmProvider>
  );
};
export default Layout;
