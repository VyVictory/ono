import { Outlet } from "react-router-dom";
import SiderBar from "../components/siderbar/SiderBar";
import FixedBottomNavigation from "../components/FixedBottomNavigation";

const HomeLayout = () => {
  return (
    <div className="flex h-screen NavbarUser">
      {/* Sidebar (nếu có) */}

      <SiderBar />
      {/* Nội dung chính */}
      {/* Header */}
      {/* Main content - React Router sẽ hiển thị nội dung tại đây */}
      <main className="flex-1 flex flex-col  lg:px-4 xl:px-0">
        {/* <FixedBottomNavigation /> */}
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
