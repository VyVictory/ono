import { ButtonBase } from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import { useModule } from "./context/Module";
export default function FilePreview({ fileUrl }) {
  const fileType = fileUrl.split(".").pop().toLowerCase(); // Lấy phần mở rộng file
  const { setZoomImg } = useModule();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
    return (
      <ButtonBase onClick={() => setZoomImg(`${fileUrl}`)}>
        <img
          src={fileUrl}
          alt="preview"
          className="max-w-full h-auto rounded-md"
        />
      </ButtonBase>
    );
  }

  if (["mp4", "webm", "ogg"].includes(fileType)) {
    return <ReactPlayer url={fileUrl} controls width="auto" height="100%" />;
  }

  if (["mp3", "wav", "ogg"].includes(fileType)) {
    return (
      <audio controls className="w-full">
        <source src={fileUrl} type={`audio/${fileType}`} />
      </audio>
    );
  }

  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileType)) {
    return (
      <iframe
        src={`https://docs.google.com/gview?url=${fileUrl}&embedded=true`}
        className="w-full h-[500px] border"
        title="Document Viewer"
      />
    );
  }

  if (["zip", "rar"].includes(fileType)) {
    return (
      <ButtonBase className="p-4 border rounded-md">
        <p>📁 Không thể xem file RAR/ZIP trực tiếp.</p>
        <a href={fileUrl} download className="text-blue-500 underline">
          Tải xuống
        </a>
      </ButtonBase>
    );
  }

  return <p>❌ Không hỗ trợ định dạng này: {fileType}</p>;
}

// Cách gọi component:
// <FilePreview fileUrl="https://example.com/sample.mp4" />
