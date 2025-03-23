import React, { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";

const ImageZoomModal = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose(); // Ấn phím ESC để tắt modal
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50 transition-opacity duration-300"
      onClick={onClose} // Nhấn ngoài modal để đóng
    >
      <div
        className="relative w-auto p-4"
        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện đóng khi click vào ảnh
      >
        {/* Nút đóng */}
        <button
          className="absolute top-3 right-3 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600 transition"
          onClick={onClose}
        >
          <XMarkIcon className="h-7 w-7" />
        </button>

        {/* Ảnh phóng to */}
        <img
          src={imageUrl}
          alt="Zoomed"
          className="w-[80dvh] h-auto max-h-[90dvh] object-contain rounded-lg shadow-2xl transform transition-all scale-100 hover:scale-105 duration-200"
        />
      </div>
    </div>
  );
};

export default ImageZoomModal;
