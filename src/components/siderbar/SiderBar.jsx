import { Paper } from "@mui/material";
import ContentSiderBar from "./ContetentSiderBar";

const SiderBar = () => {
  return (
    <>
      <Paper
        elevation={2}
        className="w-64 h-full relative overflow-y-auto hidden lg:block bg-gray-100 p-4 "
      >
        <nav>
          <ContentSiderBar />
        </nav>
      </Paper>
    </>
  );
};

export default SiderBar;
