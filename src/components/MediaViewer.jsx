import { useState } from "react";
import { Card } from "@/components/ui/card";
import { FileIcon, XIcon } from "lucide-react";

export default function MediaViewer({ src }) {
  const [fileType, setFileType] = useState(getFileType(src));
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  function getFileType(url) {
    if (!url) return "unknown";
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    return "file";
  }

  function handlePreview() {
    setIsPreviewOpen(true);
  }

  return (
    <>
      {/* Thẻ hiển thị chính */}
      <Card className="p-4 flex items-center justify-center border rounded-lg w-full max-w-md cursor-pointer" onClick={handlePreview}>
        {fileType === "image" ? (
          <img src={src} alt="Media" className="max-w-full max-h-60 rounded-lg" />
        ) : fileType === "video" ? (
          <video controls className="max-w-full max-h-60 rounded-lg">
            <source src={src} type="video/mp4" />
            Trình duyệt không hỗ trợ video.
          </video>
        ) : (
          <div className="flex flex-col items-center">
            <FileIcon className="w-12 h-12 text-gray-500" />
            <p className="text-sm mt-2 text-gray-700">Tệp tin không hiển thị được</p>
          </div>
        )}
      </Card>

      {/* Modal hiển thị ảnh/video phóng to */}
      {isPreviewOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-80 z-50">
          <div className="relative p-4">
            <button className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2" onClick={() => setIsPreviewOpen(false)}>
              <XIcon className="w-6 h-6" />
            </button>
            {fileType === "image" ? (
              <img src={src} alt="Preview" className="max-w-[90vw] max-h-[90vh] rounded-lg" />
            ) : fileType === "video" ? (
              <video controls className="max-w-[90vw] max-h-[90vh] rounded-lg">
                <source src={src} type="video/mp4" />
              </video>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
