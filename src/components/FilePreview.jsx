import { ButtonBase } from "@mui/material";
import React from "react";
import ReactPlayer from "react-player";
import { useModule } from "./context/Module";
export default function FilePreview({ fileUrl, pop, popcontainer }) {
  const fileType = fileUrl.split(".").pop().toLowerCase(); // Lấy phần mở rộng file
  const { setZoomImg } = useModule();
  const isImage =
    fileUrl.startsWith("blob:") || // Nếu URL bắt đầu với "blob:"
    ["jpg", "jpeg", "png", "gif", "webp"].some((ext) =>
      fileUrl.toLowerCase().endsWith(`.${ext}`)
    );
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType) || isImage) {
    return (
      <div
        className={`cursor-pointer`}
        onClick={() => setZoomImg(`${fileUrl}`)}
      >
        <img
          src={fileUrl}
          alt="preview"
          className={pop || `max-w-full rounded-md w-full h-auto`}
        />
      </div>
    );
  }

  if (["mp4", "webm", "ogg"].includes(fileType)) {
    return (
      <video width="100%" controls>
        <source src={fileUrl} type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>
    );
  }
//  <ReactPlayer url={fileUrl} controls width="auto" height="100%" /> 
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
