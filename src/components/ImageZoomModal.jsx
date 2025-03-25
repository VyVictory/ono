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
      className="fixed inset-0 flex items-center w-screen h-[100dvh] justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300 z-[99999]"
      onClick={onClose} // Nhấn ngoài modal để đóng
    >
      <div
        className="relative w-auto p-4"
        onClick={(e) => e.stopPropagation()} // Ngăn sự kiện đóng khi click vào ảnh
      >
        {/* Nút đóng */}
        <button
          className="fixed top-3 right-3 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600 transition z-50"
          onClick={onClose}
        >
          <XMarkIcon className="h-7 w-7" />
        </button>

        {/* Ảnh phóng to */}
        <img
          src={imageUrl}
          alt="Zoomed"
          className="w-full h-auto max-h-screen max-w-screen object-contain rounded-lg shadow-2xl transform transition-all scale-100"
        />
      </div>
    </div>
  );
};

export default ImageZoomModal;
