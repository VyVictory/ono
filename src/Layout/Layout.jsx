import NavBar from "../components/Navbar/NavBar";
import { Outlet } from "react-router-dom";
import Login from "../components/Auth/Login";
import { ConfirmProvider } from "../components/context/ConfirmProvider";
import ThemeToggle from "../components/ThemeToggle";
import { ModuleProvider } from "../components/context/Module";
const Layout = () => {
  return (
    <>
      <div className="fixed inset-0  bg-gray-100 -z-10"></div>
      <NavBar />
      <Outlet />{" "}
    </>
  );
};
export default Layout;
