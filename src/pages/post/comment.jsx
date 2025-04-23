import { Paper } from "@mui/material";

export const Comment = ({ open }) => {
  return <>{open ? <Paper className="border-t">CMT</Paper> : ""}</>;
};
