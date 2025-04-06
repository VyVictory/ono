import React, { useState, useEffect, useRef } from "react";
import FriendSiderBar from "./FriendSiderBar";
import GroupSiderBar from "./GroupSiderBar";
import { Paper } from "@mui/material";
const RightBar = () => {
  return (
    <>
      {" "}
      <div className="w-64 relative h-full hidden lg:block right-0">
        <nav className="relative h-full overflow-hidden">
          <div className="h-full overflow-y-auto flex flex-col p-2 gap-4">
            <Paper elevation={1} className="w-full bg-gray-100 p-4 ">
              <FriendSiderBar />
            </Paper>
            <Paper elevation={1} className="w-full bg-gray-100 p-4 ">
              <GroupSiderBar />
            </Paper>
          </div>
        </nav>
      </div>
    </>
  );
};

export default RightBar;
