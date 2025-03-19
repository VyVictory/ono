import { useEffect, useRef, useState, useMemo } from "react";
import React from "react";
import UseMessageInfo from "./UseMessageInfo";
import { getMessageInbox } from "../../service/message";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import { useAuth } from "../../components/context/AuthProvider";
import LoadingAnimation from "../../components/LoadingAnimation";

import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useSocketContext } from "../../components/context/socketProvider";

const Inbox = ({ newmess }) => {
  const { profile, isLoadingProfile } = useAuth();
  const { newMessInbox } = useSocketContext();
  const lastMessageRef = useRef(null);
  const containerRefMess = useRef(null);
  const { id } = UseMessageInfo();
  const [messagesByDay, setMessagesByDay] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const messagesByDayMemo = useMemo(() => messagesByDay, [messagesByDay]); 
  const fetchMessages = async (newPage = 0) => {
    if (!containerRefMess.current) return;

    const previousScrollHeight = containerRefMess.current.scrollHeight;
    const previousScrollTop = containerRefMess.current.scrollTop;

    try {
      const data = await getMessageInbox(id, newPage * 20, 20);
      if (data && data.length > 0) {
        setMessagesByDay((prev) => {
          // Gộp tin nhắn theo ngày
          const mergedMessages = [...data, ...prev].reduce((acc, curr) => {
            const existing = acc.find((item) => item.daytime === curr.daytime);
            if (existing) {
              existing.mess = [...existing.mess, ...curr.mess]; // Đảo lại: Thêm tin nhắn mới vào cuối
            } else {
              acc.push({ ...curr }); // Thêm vào danh sách theo thứ tự dữ liệu đến
            }
            return acc;
          }, []);

          // Sắp xếp nhóm ngày theo thời gian mới nhất trước
          mergedMessages.sort(
            (a, b) => new Date(b.daytime) - new Date(a.daytime)
          );

          // Sắp xếp tin nhắn bên trong mỗi ngày theo thời gian tăng dần
          mergedMessages.forEach((group) => {
            group.mess.sort((a, b) => new Date(a.time) - new Date(b.time));
          });

          return mergedMessages;
        });

        setPage(newPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Lỗi khi lấy tin nhắn:", error);
    }

    setTimeout(() => {
      if (containerRefMess.current) {
        containerRefMess.current.scrollTop =
          containerRefMess.current.scrollHeight -
          previousScrollHeight +
          previousScrollTop;
      }
    }, 100);
  };
  useEffect(() => {
    if (id) {
      fetchMessages(0);
    }
  }, [id, isLoadingProfile]);
  const addMessages = (message) => {
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
        const messageDate = format(new Date(message.createdAt), "yyyy-MM-dd");
        const existingGroup = updatedMessages.find(
          (group) =>
            format(new Date(group.daytime), "yyyy-MM-dd") === messageDate
        );

        if (existingGroup) {
          existingGroup.mess.push(newMessage);
        } else {
          updatedMessages.push({
            daytime: message.createdAt,
            mess: [newMessage],
          });
        }
        return updatedMessages;
      });
    }
    setIsScroll(false);
  };
  const mergeMessages = (messages) => {
    const uniqueMessages = new Map();

    messages.forEach((day) => {
      day.mess.forEach((msg) => {
        uniqueMessages.set(msg._id, msg);
      });
    });

    return Array.from(uniqueMessages.values());
  };

  useEffect(() => {
    if (newmess?.length) {
      setMessagesByDay((prev) => mergeMessages([...prev, ...newmess]));
    }
    addMessages(newmess);
  }, [newmess]);

  useEffect(() => {
    addMessages(newMessInbox?.message);
  }, [newMessInbox]);

  useEffect(() => {
    if (!isLoadingProfile && lastMessageRef.current && !isScroll) {
      scroll();
      setIsScroll(true);
    }
  }, [messagesByDay, isLoadingProfile]);
  useEffect(() => {
    if (!containerRefMess.current) {
      console.warn("containerRefMess chưa được gán!");
      return;
    }
    const handleScroll = () => {
      const scrollTop = containerRefMess.current.scrollTop;
      const scrollHeight = containerRefMess.current.scrollHeight;
      const clientHeight = containerRefMess.current.clientHeight;
      setShowScrollButton(scrollTop < scrollHeight - clientHeight - 150);
    };
    containerRefMess.current.addEventListener("scroll", handleScroll);

    return () => {
      containerRefMess.current.removeEventListener("scroll", handleScroll);
    };
  }, [isLoadingProfile]);

  const scroll = () => {
    lastMessageRef.current.scrollIntoView({ behavior: "auto" });
  }; 
  if (isLoadingProfile) {
    return <LoadingAnimation />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div ref={containerRefMess} className="flex-1 overflow-y-auto p-4">
        {hasMore && (
          <button
            onClick={async () => {
              setIsLoadingMore(true); // Bật trạng thái loading
              await fetchMessages(page + 1); // Chờ lấy tin nhắn xong
              setIsLoadingMore(false); // Tắt trạng thái loading
            }}
            className="w-full text-center py-2 mb-4 text-blue-500 hover:underline"
            disabled={isLoadingMore} // Chặn spam click khi đang load
          >
            {isLoadingMore ? (
              <div className="w-full flex justify-center">
                <LoadingAnimation />
              </div>
            ) : (
              "Xem thêm tin nhắn"
            )}
          </button>
        )}

        {messagesByDayMemo.map((group, dayIndex) => (
          <div key={dayIndex}>
            <div className="text-center text-gray-500 text-sm mb-2">
              {format(new Date(group.daytime), "dd, MMMM, yyyy", {
                locale: vi,
              })}
            </div>
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
                    className={`p-3 rounded-lg shadow-md min-w-20 max-w-xs ${
                      isMe && "bg-blue-100"
                    }`}
                  >
                    {msg.content && (
                      <p className="break-words whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    )}

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
        {showScrollButton && (
          <button
            onClick={scroll}
            className="sticky bottom-0 right-0 bg-blue-200 opacity-25 text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition"
          >
            <ArrowDownIcon className="h-6 aspect-square" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Inbox;
