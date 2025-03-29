import NavBar from "../components/Navbar/NavBar";
import { Outlet } from "react-router-dom";
import Login from "../components/Auth/Login";
import { ConfirmProvider } from "../components/context/ConfirmProvider";
import ThemeToggle from "../components/ThemeToggle";
import { SocketProvider } from "../components/context/socketProvider";
import { ModuleProvider } from "../components/context/Module";
const Layout = () => {
  return (
    <SocketProvider>
      <ModuleProvider>
        <ConfirmProvider>
          <div className="fixed inset-0  bg-gray-100 -z-10"></div>
          <NavBar />
          <Outlet />
        </ConfirmProvider>
      </ModuleProvider>
    </SocketProvider>
  );
};
export default Layout;
