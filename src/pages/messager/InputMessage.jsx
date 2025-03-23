import React, { useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ButtonBase,
} from "@mui/material";
import UseMessageInfo from "./UseMessageInfo";
import { SendToUser } from "../../service/message";
import LoadingAnimation from "../../components/LoadingAnimation";
import { useAuth } from "../../components/context/AuthProvider";
import socketConfig from "../../service/socket/socketConfig";
import { Paper } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/solid";

const InputMessage = ({ newmess }) => {
  const { profile } = useAuth();
  const [isSend, setIsSend] = useState(true);
  const { type, id } = UseMessageInfo();
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [imagesFull, setImagesFull] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleSendMessage = () => {
    setIsSend(false);

    if (!id || (!message && imagesFull.length <= 0)) {
      setIsSend(true);
      return;
    }

    SendToUser(id, message, imagesFull)
      .then((response) => {
        socketConfig.emit("sendMessage", {
          text: response.data.content,
        });
        newmess(response.data);
        // console.log(imagesFull);
        setImages([]);
        setImagesFull([]);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      })
      .finally(() => {
        setIsSend(true);
        setMessage("");

        // Reset textarea height
        const textarea = document.querySelector("textarea");
        if (textarea) {
          textarea.style.height = "auto";
        }
      });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagesFull((prevImages) => [...prevImages, ...files]);
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prevImages) => [...prevImages, ...imagePreviews]);
  };

  const handleChange = (e) => {
    const newValue = e.target.value;
    setMessage(newValue);

    // Automatically adjust the textarea height
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height to auto to shrink on content deletion
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on content

    // Ensure textarea doesn't grow beyond 3 lines
    const lineHeight = parseInt(getComputedStyle(textarea).lineHeight, 10);
    const maxHeight = lineHeight * 3;
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = "auto"; // Show scrollbar when exceeding 3 lines
    } else {
      textarea.style.overflowY = "hidden"; // Hide scrollbar if within 3 lines
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Ngăn xuống dòng
      handleSendMessage();
    }
  };

  return (
    <>
      {images.length > 0 && (
        <div className="flex space-x-2 p-2 bg-gray-100">
          {images.slice(0, 3).map((img, index) => (
            <Paper key={index} className="relative">
              <img
                src={img}
                alt="preview"
                className="w-16 h-16 rounded-md object-cover border pointer-events-auto"
              />
              <button
                onClick={() =>
                  setImages((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute top-0 right-0 bg-red-500 opacity-50 text-white p-1 rounded-full hover:opacity-100 hover:scale-110 transition"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </Paper>
          ))}
          {images.length > 3 && (
            <button
              onClick={() => setOpenModal(true)}
              className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-md"
            >
              +{images.length - 3}
            </button>
          )}
        </div>
      )}

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        className="relative"
      >
        <button
          onClick={() => setOpenModal(false)}
          className="absolute top-1 right-1 bg-red-500 opacity-50 text-white p-1 rounded-full hover:opacity-100  transition"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
        <DialogTitle>Danh sách ảnh</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {images.map((img, index) => (
              <ButtonBase
                onClick={() => console.log("ono")}
                key={index}
                className="relative p-1"
              >
                <Paper className="w-24 h-24 aspect-square flex justify-center items-center relative">
                  <img
                    key={index}
                    src={img}
                    alt="preview"
                    className="w-auto h-24 object-cover rounded-md"
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation(); // Ngăn chặn sự kiện lan ra ButtonBase
                      setImages((prev) => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-1 right-1 bg-red-500 opacity-50 text-white p-1 rounded-full hover:opacity-100 hover:scale-110 transition"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </div>
                </Paper>
              </ButtonBase>
            ))}
          </div>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Đóng
          </Button>
        </DialogActions> */}
      </Dialog>

      <div className="border-t flex flex-1  pointer-events-auto p-2">
        <div className="flex items-center flex-row space-x-1 pr-2">
          <label htmlFor="imageUpload" className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="imageUpload"
            />
            <svg
              className="size-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="white"
            >
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop
                    offset="0%"
                    style={{ stopColor: "#6ee7b7", stopOpacity: 1 }}
                  />
                  <stop
                    offset="100%"
                    style={{ stopColor: "#3b82f6", stopOpacity: 1 }}
                  />
                </linearGradient>
                <filter
                  id="shadow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feDropShadow
                    dx="2"
                    dy="2"
                    stdDeviation="2"
                    floodOpacity="0.15"
                  />
                </filter>
              </defs>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                fill="url(#grad1)"
                stroke="white"
                strokeWidth="2"
                filter="url(#shadow)"
              />
            </svg>
          </label>

          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-8"
            >
              <defs>
                <style>{".b{fill:#864e20}"}</style>
              </defs>
              <rect
                x="1"
                y="1"
                width="22"
                height="22"
                rx="7.656"
                style={{ fill: "#f8de40" }}
              />
              <path
                className="b"
                d="M14 11.207a.32.32 0 0 0-.313.327 2.1 2.1 0 0 1-.5 1.33A1.593 1.593 0 0 1 12 13.3a1.6 1.6 0 0 1-1.187-.43 2.088 2.088 0 0 1-.5-1.334.32.32 0 1 0-.64-.012 2.712 2.712 0 0 0 .679 1.791 2.211 2.211 0 0 0 1.648.623 2.211 2.211 0 0 0 1.647-.626 2.718 2.718 0 0 0 .679-1.791.322.322 0 0 0-.326-.314z"
              />
              <path
                d="M23 13.938a14.69 14.69 0 0 1-12.406 6.531c-5.542 0-6.563-1-9.142-2.529A7.66 7.66 0 0 0 8.656 23h6.688A7.656 7.656 0 0 0 23 15.344z"
                style={{ fill: "#e7c930" }}
              />
              <path
                className="b"
                d="M9.6 8.833 9.021 8.6a22.797 22.797 0 0 0-2.138-.774 18.44 18.44 0 0 0-1.1-.3h-.012a.246.246 0 0 0-.186.448l.01.006c.325.2.656.392.991.573q.281.15.564.291a.245.245 0 0 1 0 .439q-.285.141-.564.292c-.335.18-.667.369-.992.573l-.016.01a.246.246 0 0 0 .187.447h.018c.374-.088.741-.19 1.105-.3s.723-.234 1.079-.362c.179-.064.355-.134.532-.2l.526-.213.573-.232a.246.246 0 0 0 .002-.465zM18.81 9.844a.182.182 0 0 1-.331.1 2.026 2.026 0 0 0-.568-.567 1.732 1.732 0 0 0-1.916 0 2.016 2.016 0 0 0-.571.569.182.182 0 0 1-.331-.1 1.632 1.632 0 0 1 .346-1.023 1.927 1.927 0 0 1 3.026 0 1.64 1.64 0 0 1 .345 1.021z"
              />
            </svg>
          </button>
        </div>
        <div className="flex items-center flex-grow">
          <div className=" flex-grow h-full flex items-center">
            <div className="flex-grow h-full border border-gray-300 px-2 rounded-2xl shadow-inner shadow-slate-300 pt-1">
              <textarea
                placeholder="Nhập tin nhắn..."
                value={message}
                onChange={handleChange}
                onKeyDown={handleKeyDown} // Thêm sự kiện này
                className=" text-gray-700 pt-1 text-sm w-full h-full shadow-inner focus:outline-none focus:ring-0 focus:ring-none 
                  resize-none focus:ring-none "
                rows="1"
                style={{ overflowY: "hidden" }}
              />
            </div>
          </div>
          {isSend ? (
            <button
              onClick={handleSendMessage}
              className="group relative"
              aria-label="Send message"
            >
              <PaperAirplaneIcon
                title="Gửi tin nhắn"
                className="h-10 w-10 p-1 rounded-full text-blue-400 hover:scale-110 hover:shadow-sm hover:shadow-blue-400/50 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700 active:scale-95 active:transition-all"
              />
              <span className="absolute z-30 right-0 bottom-full w-max p-2 bg-gray-500 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Gửi tin nhắn
              </span>
            </button>
          ) : (
            <LoadingAnimation />
          )}
        </div>
      </div>
    </>
  );
};

export default InputMessage;
