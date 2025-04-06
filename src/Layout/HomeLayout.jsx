import { Outlet } from "react-router-dom";
import SiderBar from "../components/siderbar/SiderBar";
import FixedBottomNavigation from "../components/FixedBottomNavigation";
import RightBar from "../components/siderbar/RightBar";

const HomeLayout = () => {
  return (
    <div className="flex relative h-[100dvh] NavbarUser">
      <main className="flex-1 flex flex-col  lg:px-4 xl:px-0">
        {/* <FixedBottomNavigation /> */}
        <Outlet />
      </main>
      <div className="absolute bottom-0 left-0 h-full NavbarUser">
        <SiderBar />
      </div>
      <div className="absolute bottom-0 right-0 h-full NavbarUser mr-2">
        <RightBar />
      </div>
    </div>
  );
};

export default HomeLayout;
