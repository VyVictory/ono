import { useState } from "react";
import { IconButton, Modal, TextField } from "@mui/material";
import {
  XCircleIcon,
  PlusCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { VideoCameraIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { Delete } from "@mui/icons-material";
import { IconsManifest } from "react-icons/lib";
import { useConfirm } from "./context/ConfirmProvider";
import { toast } from "react-toastify";
export default function PostForm({ children }) {
  const confirm = useConfirm();
  const [isOpen, setIsOpen] = useState(false);
  const [post, setPost] = useState({ content: "", images: [], video: null });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [direction, setDirection] = useState("next");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng bài viết:", post);
    setIsOpen(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 20; // Đặt giới hạn tối đa là 50 ảnh
    const currentCount = post.images.length;
    const remainingSlots = maxImages - currentCount;

    if (remainingSlots <= 0) {
      toast.info(`Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh.`, {
        autoClose: 3000,
      });
      return;
    }

    const validImageTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
    ];
    const newImages = [];

    for (let file of files) {
      if (!validImageTypes.includes(file.type)) {
        // alert(`"${file.name}" không phải là tệp ảnh hợp lệ!`);
        toast.error(`"${file.name}" không phải là tệp ảnh hợp lệ!`, {
          autoClose: 3000,
        });
        continue; // Bỏ qua tệp không hợp lệ
      }
      if (newImages.length < remainingSlots) {
        newImages.push({
          file,
          url: URL.createObjectURL(file),
        });
      }
    }

    if (newImages.length > 0) {
      setPost((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  const handleVideoUpload = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      // Danh sách định dạng video hợp lệ
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validVideoTypes.includes(file.type)) {
        // alert(`"${file.name}" không phải là tệp video hợp lệ!`);
        toast.error(`"${file.name}" không phải là tệp video hợp lệ!`, {
          autoClose: 3000,
        });
        return;
      }
      const videoUrl = URL.createObjectURL(file);
      // Cập nhật video mới
      setPost((prev) => ({
        ...prev,
        video: { file, url: videoUrl },
      }));
      // Reset input file để cho phép chọn lại cùng một file
      e.target.value = null;
    }
  };

  const toggleSelectImage = (index) => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };
  const removeVideo = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn xóa video này?");
    if (!isConfirmed) return;
    setPost((prev) => ({ ...prev, video: null }));
  };
  const removeSelectedImages = async () => {
    const isConfirmed = await confirm("Bạn có chắc muốn xóa ảnh đã chọn?");
    if (!isConfirmed) return;
    setPost((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => !selectedImages.includes(i)),
    }));
    setSelectedImages([]);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="cursor-pointer w-full">
        {children}
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4 lg:px-0"
          onClick={() => setIsOpen(false)} // Khi bấm vào nền đen, đóng modal
        >
          <div
            onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào bên trong
            className="bg-white shadow-lg shadow-violet-950 rounded-lg border border-gray-200 w-full max-w-[500px] relative flex flex-col p-4"
          >
            <div className="w-full flex justify-between mb-4">
              <div>
                {" "}
                {post.images.length > 0 && (
                  <button
                    onClick={() => setShowGallery(true)}
                    className="text-sm font-semibold bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
                  >
                    Xem tất cả ảnh
                  </button>
                )}
              </div>
              <XCircleIcon
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 text-gray-500 hover:text-red-700 cursor-pointer"
              />
            </div>

            <h2 className="text-xl font-bold text-center mb-3 w-full absolute pointer-events-none">
              Đăng bài viết
            </h2>

            <TextField
              label="Nội dung..."
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              size="small"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              sx={{
                "& fieldset": {
                  borderLeft: "none",
                  borderRight: "none",
                  borderBottom: "none",
                  borderRadius: 0, // Loại bỏ bo góc
                }, // Loại bỏ border trái và phải
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderLeft: "none",
                    borderRight: "none",
                    borderBottom: "none",
                    borderRadius: 0,
                  },
                  "&.Mui-focused fieldset": {
                    borderLeft: "none",
                    borderRight: "none",
                    borderBottom: "none",
                    borderRadius: 0,
                  },
                },
              }}
            />

            {/* img show */}
            {post.images.length > 0 && (
              <div className="relative flex items-center justify-center w-full h-48 mt-3 overflow-hidden border">
                {post.images.length > 1 && (
                  <button
                    onClick={() => {
                      setDirection("prev");
                      setCurrentIndex((prev) =>
                        prev > 0 ? prev - 1 : post.images.length - 1
                      );
                    }}
                    className="absolute left-2 z-10 bg-gray-500 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                  </button>
                )}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={post.images[currentIndex].url}
                    src={post.images[currentIndex].url}
                    alt="uploaded"
                    className="absolute w-full h-full object-contain rounded-md"
                    initial={{
                      x: direction === "next" ? "100%" : "-100%",
                      opacity: 0.1,
                    }}
                    animate={{ x: "0%", opacity: 1 }}
                    exit={{
                      x: direction === "next" ? "-100%" : "100%",
                      opacity: 0.1,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  />
                </AnimatePresence>

                {post.images.length > 1 && (
                  <button
                    onClick={() => {
                      setDirection("next");
                      setCurrentIndex((prev) =>
                        prev < post.images.length - 1 ? prev + 1 : 0
                      );
                    }}
                    className="absolute right-2 z-10 bg-gray-500 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-white" />
                  </button>
                )}
              </div>
            )}
            {/* video show */}
            {post.video && (
              <div className="relative mt-3 border">
                <video
                  key={post?.video?.url}
                  controls
                  className="w-full rounded-md max-h-[30vh]"
                >
                  <source src={post?.video?.url} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
                <button
                  onClick={() => removeVideo()}
                  className="absolute top-2 right-2  rounded-full p-1 hover:bg-red-300"
                >
                  <XCircleIcon className="w-5 h-5 text-red-500" />
                </button>
              </div>
            )}

            <div className="flex overflow-x-auto  mt-2 space-x-2 py-1 rounded-xl">
              {post.images.length > 0 && (
                <div className="flex justify-center sticky left-0">
                  <label className="flex items-center justify-center w-16 h-16 bg-gray-200 rounded-md cursor-pointer opacity-75 hover:opacity-100 transition-opacity duration-200">
                    <PlusCircleIcon className="w-8 h-8 text-gray-600" />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              )}
              {post.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt="thumbnail"
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 hover:scale-105 duration-500 ${
                    selectedImages.includes(index)
                      ? "border-red-500 border-4  "
                      : ""
                  }`}
                  onClick={() => toggleSelectImage(index)}
                />
              ))}
            </div>
            <div className="h-14 w-full border-t mt-2 flex justify-between items-center px-2 overflow-x-auto">
              <div className="flex flex-row space-x-2">
                {post.video == null && (
                  <button className="flex flex-row p-2  rounded-lg space-x-2 hover:bg-violet-200 shadow-sm shadow-gray-400 bg-violet-100">
                    <label className="flex items-center justify-center cursor-pointer">
                      <PhotoIcon className="h-6 w-6 text-blue-500 hover:scale-125" />
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </button>
                )}
                {post.images.length == 0 && (
                  <button className="flex flex-row p-2  rounded-lg  hover:bg-red-200 shadow-sm shadow-gray-400 bg-red-100">
                    <label className="flex items-center justify-center cursor-pointer">
                      <VideoCameraIcon className="h-6 w-6 text-red-500 hover:scale-125" />
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleVideoUpload}
                      />
                    </label>
                  </button>
                )}
              </div>
              <div className="flex flex-row space-x-4">
                {selectedImages.length > 0 && (
                  <button onClick={removeSelectedImages} className=" ">
                    <TrashIcon className="w-10 h-10 text-red-400 hover:scale-110  hover:text-red-500  shadow-violet-200 duration-300" />
                  </button>
                )}
                {post.images.length > 0 && (
                  <button
                    onClick={() => {
                      if (selectedImages.length === post.images.length) {
                        setSelectedImages([]); // Hủy chọn tất cả
                      } else {
                        setSelectedImages(post.images.map((_, index) => index)); // Chọn tất cả
                      }
                    }} 
                  >
                    {selectedImages.length === post.images.length ? (
                      <XCircleIcon className="w-10 h-10 hover:scale-110 text-red-400 duration-300" />
                    ) : (
                      <CheckCircleIcon className="w-10 h-10 hover:scale-110 duration-300 text-green-500" />
                    )}
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className="w-full mt-4 bg-violet-500 text-white py-2 rounded-lg hover:bg-violet-600"
            >
              Đăng bài
            </button>
          </div>
        </motion.div>
      </Modal>

      {showGallery && post.images.length > 0 && (
        <Modal open={showGallery} onClose={() => setShowGallery(false)}>
          <motion.div
            // initial={{ opacity: 0, scale: 0.8 }}
            // animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setShowGallery(false)} // Khi bấm vào nền đen, đóng modal
            className="fixed inset-0 flex items-center justify-center bg-black h-screen p-4 bg-opacity-20"
          >
            <div
              onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng modal khi click vào bên trong
              className="bg-white shadow-lg rounded-lg p-1 "
            >
              <div className="flex justify-between items-center p-2 border-b shadow-lg">
                <div className="flex justify-center space-x-4">
                  {/* Nút chọn tất cả / Hủy chọn tất cả */}
                  {post.images.length > 0 && (
                    <button
                      onClick={() => {
                        if (selectedImages.length === post.images.length) {
                          setSelectedImages([]); // Hủy chọn tất cả
                        } else {
                          setSelectedImages(
                            post.images.map((_, index) => index)
                          ); // Chọn tất cả
                        }
                      }}
                      className=" w-10 h-10   "
                    >
                      {selectedImages.length === post.images.length ? (
                        <XCircleIcon className="w-10 h-10 text-red-500" />
                      ) : (
                        <CheckCircleIcon className="w-10 h-10 text-green-500" />
                      )}
                    </button>
                  )}
                  {selectedImages.length > 0 && (
                    <button
                      onClick={removeSelectedImages}
                      className=" "
                    >
                      <TrashIcon className="w-10 h-10 text-red-500 hover:scale-110 duration-300 hover:text-red-600" />
                    </button>
                  )}
                </div>

                <XCircleIcon
                  className="w-10 h-10 text-gray-500 cursor-pointer hover:text-red-700"
                  onClick={() => setShowGallery(false)}
                />
              </div>
              <div className="   w-full h-[80vh] overflow-y-auto p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-4 space-x-4 space-y-2">
                  {post.images.map((img, index) => (
                    <div
                      key={index}
                      className={` ${
                        selectedImages.includes(index)
                          ? "border-red-500 border-2"
                          : ""
                      } relative shadow-lg shadow-violet-200  flex items-center justify-center border  hover:scale-105 duration-500 `}
                    >
                      <img
                        src={img?.url}
                        alt="gallery-img"
                        className={`h-32  object-cover cursor-pointer  `}
                        onClick={() => setCurrentIndex(index)}
                      />
                      <button
                        onClick={() => toggleSelectImage(index)}
                        className={`absolute top-1 right-1 rounded-full p-1 ${
                          selectedImages.includes(index) ? "bg-green-500" : ""
                        } text-white hover:`}
                      >
                        {selectedImages.includes(index) ? (
                          <CheckCircleIcon className="w-4 h-4" />
                        ) : (
                          <div className="w-4 h-4 bg-none border-2 border-gray-500 opacity-60 hover:opacity-100 rounded-full"></div>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Modal>
      )}
    </>
  );
}
