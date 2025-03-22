import React from "react";
import ReactPlayer from "react-player"; 

export default function FilePreview({ fileUrl }) {
  const fileType = fileUrl.split(".").pop().toLowerCase(); // Lấy phần mở rộng file

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileType)) {
    return <img src={fileUrl} alt="preview" className="max-w-full h-auto rounded-md" />;
  }

  if (["mp4", "webm", "ogg"].includes(fileType)) {
    return <ReactPlayer url={fileUrl} controls width="100%" height="400px" />;
  }

  if (["mp3", "wav", "ogg"].includes(fileType)) {
    return <audio controls className="w-full"><source src={fileUrl} type={`audio/${fileType}`} /></audio>;
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
      <div className="p-4 border rounded-md">
        <p>📁 Không thể xem file RAR/ZIP trực tiếp.</p>
        <a href={fileUrl} download className="text-blue-500 underline">
          Tải xuống
        </a>
      </div>
    );
  }

  return <p>❌ Không hỗ trợ định dạng này: {fileType}</p>;
}

// Cách gọi component:
// <FilePreview fileUrl="https://example.com/sample.mp4" />
