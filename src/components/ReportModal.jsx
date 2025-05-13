import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
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

const ReportModal = ({ open, onClose, onSubmit }) => {
  const [reportType, setReportType] = useState("");
  const [customReason, setCustomReason] = useState("");
  const { report, setReport } = useModule();

  const handleSubmit = async () => {
    const reason = reportType === "Khác" ? customReason : reportType;
    if (!reason.trim()) return alert("Vui lòng nhập nội dung tố cáo");

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

    // Reset state
    setReportType("");
    setCustomReason("");
    setReport(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     bg-white p-6 rounded-2xl w-full max-w-md md:w-96 shadow-2xl border border-gray-200"
      >
        <Typography
          variant="h6"
          className="text-center font-semibold text-gray-800 mb-5"
        >
          Tố Cáo Vi Phạm
        </Typography>

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
            label="Nhập nội dung tố cáo"
            multiline
            rows={4}
            fullWidth
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
            className="mb-4"
            size="small"
          />
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outlined" onClick={onClose} className="capitalize">
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            className="capitalize bg-red-600 hover:bg-red-700 text-white"
          >
            Gửi
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ReportModal;
