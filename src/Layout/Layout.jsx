import NavBar from "../components/Navbar/NavBar";
import { Outlet } from "react-router-dom";
import Login from "../components/Auth/Login";
import { ConfirmProvider } from "../components/context/ConfirmProvider";
import ThemeToggle from "../components/ThemeToggle";
import { SocketProvider } from "../components/context/socketProvider";
const Layout = () => {
  return (
    <SocketProvider>
      <ConfirmProvider>
        <div className="fixed inset-0   -z-10"></div>
        <NavBar />
        <Outlet />
      </ConfirmProvider>
    </SocketProvider>
  );
};
export default Layout;
