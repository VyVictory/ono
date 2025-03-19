import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import React from "react";
import UseMessageInfo from "./UseMessageInfo";
import { getMessageInbox } from "../../service/message";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import { useAuth } from "../../components/context/AuthProvider";
import LoadingAnimation from "../../components/LoadingAnimation";
import { format } from "date-fns";
import { vi } from "date-fns/locale"; // Import locale tiếng Việt (nếu cần)
import { useSocketContext } from "../../components/context/socketProvider";
const Inbox = ({ newmess }) => {
  const { profile, isLoadingProfile } = useAuth();
  const { newMessInbox } = useSocketContext();
  const lastMessageRef = useRef(null);
  const containerRefMess = useRef(null);
  const { id } = UseMessageInfo();
  const [messagesByDay, setMessagesByDay] = useState([]);
  const messagesByDayMemo = useMemo(() => messagesByDay, [messagesByDay]);
  const fetchMessages = async () => {
    try {
      const data = await getMessageInbox(id, 0, 100);
      if (data) {
        setMessagesByDay((prev) => [...prev, ...data]); // Load dần
      }
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  };
  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id]); // Chỉ gọi lại khi `id` thay đổi.
  const addMessages = async (message) => { 
    // Kiểm tra nếu message là object có _id hợp lệ
    if (message && message._id) { 
      setMessagesByDay((prevMessages) => {
        const updatedMessages = [...prevMessages];

        const newMessage = {
          _id: message._id,
          sender: message.sender._id,
          isRecalled: message.isRecalled,
          senderName: `${message.sender.firstName} ${message.sender.lastName}`,
          avatar: message.sender.avatar,
          content: message.content,
          file: message.file,
          createdAt: message.createdAt,
        };

        console.log("22222");
        const messageDate = format(new Date(message.createdAt), "yyyy-MM-dd");

        // Tìm nhóm tin nhắn theo ngày
        const existingGroup = updatedMessages.find(
          (group) =>
            format(new Date(group.daytime), "yyyy-MM-dd") === messageDate
        );

        if (existingGroup) {
          // Thêm tin nhắn mới vào nhóm hiện tại
          existingGroup.mess.push(newMessage);
        } else {
          // Tạo nhóm mới
          updatedMessages.push({
            daytime: message.createdAt,
            mess: [newMessage],
          });
        }

        return updatedMessages;
      });
    }
  };

  useEffect(() => {
    addMessages(newmess);
  }, [newmess]);
  useEffect(() => { 
    addMessages(newMessInbox?.message);
   
  }, [newMessInbox]);
  useEffect(() => {
    if (!isLoadingProfile && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messagesByDay, isLoadingProfile]);

  if (isLoadingProfile == true) {
    return <LoadingAnimation />;
  } 
  return (
    <div className="flex flex-col h-full bg-gray-100 ">
      <div ref={containerRefMess} className="flex-1 overflow-y-auto p-4">
        {messagesByDayMemo.map((group, dayIndex) => (
          <div key={dayIndex}>
            {/* Hiển thị ngày */}
            <div className="text-center text-gray-500 text-sm mb-2">
              {format(new Date(group.daytime), "dd, MMMM, yyyy", {
                locale: vi,
              })}
            </div>

            {/* Hiển thị tin nhắn trong ngày */}
            {group.mess.map((msg, index) => {
              const isMe = msg.sender === profile._id;
              return (
                <div
                  key={msg._id || index}
                  ref={
                    dayIndex === messagesByDayMemo.length - 1 &&
                    index === group.mess.length - 1
                      ? lastMessageRef
                      : null
                  }
                  className={`flex ${
                    isMe ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`p-3 rounded-lg shadow-md  min-w-20  max-w-xs ${
                      isMe && "bg-blue-100"
                    }`}
                  >
                    {msg.content && <p>{msg.content}</p>}

                    {msg.file?.url && (
                      <div className="mt-2 flex items-center space-x-2">
                        <a
                          href={msg.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-300 hover:underline flex items-center"
                        >
                          <CloudDownloadIcon className="w-5 h-5 mr-1" />
                          {msg.file.type || "Tệp đính kèm"}
                        </a>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {format(new Date(msg.createdAt), "HH:mm")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
