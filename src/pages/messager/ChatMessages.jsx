import { useEffect, useRef } from "react";

const ChatMessages = ({ messages }) => {
  const lastMessageRef = useRef(null);
  const containerRefMess = useRef(null);

  // Cuộn đến tin nhắn cuối cùng khi có tin nhắn mới
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  // Hàm cuộn xuống cuối
  const scrollToBottom = () => {
    if (containerRefMess.current) {
      containerRefMess.current.scrollTo({
        top: containerRefMess.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Danh sách tin nhắn */}
      <div
        ref={containerRefMess}
        className="flex-1 p-4 bg-gray-100 overflow-y-auto"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-2 bg-white shadow-sm rounded-md mb-2"
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            {msg}
          </div>
        ))}
      </div>

      {/* Nút cuộn xuống cuối */}

    </div>
  );
};

export default ChatMessages;
