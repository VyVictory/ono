import { useEffect, useRef, useState, useMemo, useCallback } from "react";
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
import FilePreview from "../../components/FilePreview";

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

  const fetchMessages = useCallback(
    async (newPage = 0) => {
      if (!containerRefMess.current) return;

      const previousScrollHeight = containerRefMess?.current?.scrollHeight;
      const previousScrollTop = containerRefMess?.current?.scrollTop;

      try {
        const data = await getMessageInbox(id, newPage * 20, 20);
        if (data?.length) {
          setMessagesByDay((prev) => {
            const mergedMessages = [...data, ...prev].reduce((acc, curr) => {
              const existing = acc.find(
                (item) => item.daytime === curr.daytime
              );
              if (existing) {
                existing.mess = [...existing.mess, ...curr.mess];
              } else {
                acc.push({ ...curr });
              }
              return acc;
            }, []);

            mergedMessages.sort(
              (a, b) => new Date(a.daytime) - new Date(b.daytime)
            );

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
      }, 50);
    },
    [id]
  );

  useEffect(() => {
    if (id) {
      setMessagesByDay([]);
      fetchMessages(0);
    }
  }, [id, fetchMessages, isLoadingProfile]);

  const addMessages = useCallback((message) => {
    if (!message || !message._id) return;

    setMessagesByDay((prevMessages) => {
      const updatedMessages = [...prevMessages];
      const messageDate = format(new Date(message.createdAt), "yyyy-MM-dd");
      const existingGroup = updatedMessages.find(
        (group) => format(new Date(group.daytime), "yyyy-MM-dd") === messageDate
      );

      if (existingGroup) {
        if (!existingGroup.mess.some((msg) => msg._id === message._id)) {
          existingGroup.mess.push(message);
        }
      } else {
        updatedMessages.push({
          daytime: message.createdAt,
          mess: [message],
        });
      }
      return updatedMessages;
    });

    setIsScroll(false);
  }, []);

  useEffect(() => {
    addMessages(newmess);
  }, [newmess, addMessages]);

  useEffect(() => {
    if (newMessInbox?.message?.sender?._id === id) {
      addMessages(newMessInbox?.message);
    }
  }, [newMessInbox, addMessages]);

  useEffect(() => {
    if (!isLoadingProfile && lastMessageRef.current && !isScroll) {
      scroll();
      setIsScroll(true);
    }
  }, [messagesByDay, isLoadingProfile]);
  useEffect(() => {
    if (!containerRefMess.current) return;

    let timeoutId; // Biến để lưu `setTimeout`

    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } =
        containerRefMess.current;

      // Kiểm tra có cần hiển thị nút cuộn xuống không
      setShowScrollButton(scrollTop < scrollHeight - clientHeight - 150);

      // Hủy timeout trước đó nếu người dùng cuộn tiếp tục
      clearTimeout(timeoutId);

      // Tạo một timeout mới với delay 500ms
      timeoutId = setTimeout(async () => {
        if (
          containerRefMess.current.scrollTop <= 10 &&
          hasMore &&
          !isLoadingMore
        ) {
          setIsLoadingMore(true);

          const previousHeight = containerRefMess.current.scrollHeight; // Lưu lại chiều cao trước khi tải thêm
          await fetchMessages(page + 1);

          setIsLoadingMore(false);

          // Giữ vị trí cuộn để không bị "nhảy"
          containerRefMess.current.scrollTop +=
            containerRefMess.current.scrollHeight - previousHeight;
        }
      }, 100); // Delay 500ms
    };

    containerRefMess.current.addEventListener("scroll", handleScroll);

    return () => {
      if (containerRefMess.current) {
        containerRefMess.current.removeEventListener("scroll", handleScroll);
      }
      clearTimeout(timeoutId); // Hủy timeout khi component unmount
    };
  }, [hasMore, isLoadingMore, fetchMessages, page, isLoadingProfile]);

  const scroll = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
  };
  // console.log(messagesByDayMemo);
  if (isLoadingProfile) return <LoadingAnimation />;
  console.log(messagesByDayMemo);
  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      <div ref={containerRefMess} className="flex-1 overflow-y-auto p-4">
        {hasMore && isLoadingMore ? (
          <div className="w-full flex justify-center">
            <LoadingAnimation />
          </div>
        ) : (
          ""
        )}
        {messagesByDayMemo.map((group, dayIndex) => (
          <div key={dayIndex}>
            <div className="text-center text-gray-500 text-sm mb-2">
              {format(new Date(group.daytime), "dd, MMMM, yyyy", {
                locale: vi,
              })}
            </div>
            {group.mess.map((msg, index) => {
              const isMe =
                msg.sender === profile._id || msg.sender?._id === profile._id;
              return (
                <div
                  key={index}
                  ref={
                    dayIndex === messagesByDayMemo.length - 1 &&
                    index === group.mess.length - 1
                      ? lastMessageRef
                      : null
                  }
                  className={`flex ${
                    isMe
                      ? "justify-end pl-14 md:pl-0"
                      : "justify-start pr-14 md:pr-0"
                  } mb-2`}
                >
                  <div
                    className={` rounded-lg shadow-md min-w-20 max-w-lg ${
                      isMe && "bg-blue-100"
                    }`}
                  >
                    {msg?.isRecalled ? (
                      <p className="break-words whitespace-pre-wrap p-2 pb-0 text-gray-400">
                        Tin nhắn đã được thu hồi
                      </p>
                    ) : (
                      <>
                        <>
                          {msg?.media?.length > 0 && (
                            <div
                              className={`grid  
                                 ${msg.media.length === 1 && "grid-cols-1"} 
                                 ${msg.media.length % 2 === 0 && "grid-cols-2"} 
                               ${msg.media.length % 3 === 0 && "grid-cols-3"} 
                               gap-1`}
                            >
                              {msg.media.map((file, index) => (
                                <FilePreview key={index} fileUrl={file.url} />
                              ))}
                            </div>
                          )}
                        </>

                        <>
                          {msg.content && (
                            <p className="break-words whitespace-pre-wrap p-2 pb-0">
                              {msg.content}
                            </p>
                          )}
                        </>
                      </>
                    )}

                    <div className="text-xs text-gray-400 mt-1 p-2 pt-0">
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
            className="sticky bottom-0 right-0 bg-blue-200 p-2 rounded-full shadow-lg"
          >
            <ArrowDownIcon className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Inbox;
