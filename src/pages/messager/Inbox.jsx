import { useEffect, useRef, useState } from "react";
import React from "react";
import UseMessageInfo from "./UseMessageInfo";
import { getMessageInbox } from "../../service/message";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import { useAuth } from "../../components/context/AuthProvider";

const Inbox = () => {
  const { profile } = useAuth();
  const lastMessageRef = useRef(null);
  const containerRefMess = useRef(null);
  const { id } = UseMessageInfo();
  const [messagesByDay, setMessagesByDay] = useState([]);
  useEffect(() => {
    if (id) {
      fetchMessages();
    }
  }, [id]);

  const fetchMessages = async () => {
    try {
      const data = await getMessageInbox(id, 0, 100);
      if (data) {
        setMessagesByDay(data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesByDay]);
  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      <div ref={containerRefMess} className="flex-1 overflow-y-auto p-4">
        {messagesByDay.map((group, dayIndex) => (
          <div key={dayIndex}>
            {/* Hiển thị ngày */}
            <div className="text-center text-gray-500 text-sm mb-2">
              {group.daytime}
            </div>

            {/* Hiển thị tin nhắn trong ngày */}
            {group.mess.map((msg, index) => (
              <div
                key={msg._id || index}
                ref={
                  dayIndex === messagesByDay.length - 1 &&
                  index === group.mess.length - 1
                    ? lastMessageRef
                    : null
                }
                className={`flex ${
                  msg.sender === profile._id ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`p-3 rounded-lg shadow-md max-w-xs ${
                    msg.sender === profile._id
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800"
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
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
