import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material";
import ReportIcon from "@mui/icons-material/Report";
import { useModule } from "./context/Module";
import { postReport } from "../service/report";
import { toast } from "react-toastify";

const reportTypes = [
  "Spam",
  "Ngôn từ không phù hợp",
  "Nội dung nhạy cảm",
  "Lừa đảo",
  "Khác",
];

const ReportModal = ({ open, onClose }) => {
  const [reportType, setReportType] = useState("");
  const [customReason, setCustomReason] = useState("");
  const { report, setReport } = useModule();

  const handleSubmit = async () => {
    const reason = reportType === "Khác" ? customReason : reportType;
    if (!reason.trim()) return toast.warning("Vui lòng nhập nội dung tố cáo");

    const payload = {
      ...report,
      content: reason,
    };

    const result = await postReport(payload);

    if (result) {
      toast.success("Gửi tố cáo thành công!");
    } else {
      toast.error("Gửi tố cáo thất bại!");
    }

    setReportType("");
    setCustomReason("");
    setReport(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-4 text-red-600">
          <ReportIcon fontSize="large" />
        </div>

        <Typography
          variant="h6"
          className="text-center font-semibold text-gray-800 mb-2"
        >
          Báo Cáo Vi Phạm
        </Typography>

        <Typography
          variant="body2"
          className="text-center text-gray-500 mb-4"
        >
          Vui lòng chọn lý do và cung cấp nội dung nếu cần thiết.
        </Typography>

        <Divider className="mb-4" />

        <TextField
          select
          label="Chọn loại vi phạm"
          fullWidth
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className="mb-4"
          size="small"
        >
          {reportTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {reportType === "Khác" && (
          <TextField
            label="Nội dung chi tiết"
            multiline
            rows={4}
            fullWidth
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            placeholder="Nhập nội dung cụ thể về vi phạm..."
            className="mb-4"
            size="small"
          />
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outlined"
            onClick={onClose}
            className="capitalize"
            color="inherit"
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="capitalize bg-red-600 hover:bg-red-700 text-white"
          >
            Gửi Báo Cáo
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ReportModal;
