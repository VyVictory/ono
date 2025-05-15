import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import React from "react";
import UseMessageInfo from "./UseMessageInfo";
import {
  deleteMessage,
  getMessageInbox,
  RecallMessage,
} from "../../service/message";
import { CloudDownloadIcon } from "@heroicons/react/solid";
import { useAuth } from "../../components/context/AuthProvider";
import LoadingAnimation from "../../components/LoadingAnimation";
import { ArrowDownIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useSocketContext } from "../../components/context/socketProvider";
import FilePreview from "../../components/FilePreview";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import IconButton from "@mui/material/IconButton";
import { Menu } from "@headlessui/react";
import { useConfirm } from "../../components/context/ConfirmProvider";
import { Button, ButtonBase } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useModule } from "../../components/context/Module";
import { getCmtById } from "../../service/cmt";
import { toast } from "react-toastify";
const Inbox = ({ newmess }) => {
  const confirm = useConfirm();
  const { profile, isLoadingProfile } = useAuth();
  const { setPostId, setCmtVisible } = useModule();
  const { newMessInbox, recallMessId, setRecallMessId } = useSocketContext();
  const lastMessageRef = useRef(null);
  const containerRefMess = useRef(null);
  const { id } = UseMessageInfo();
  const [messagesByDay, setMessagesByDay] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const messagesByDayMemo = useMemo(() => messagesByDay, [messagesByDay]);
  const [openMenuId, setOpenMenuId] = useState(null);

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
  const recallMessages = useCallback((idMessage) => {
    if (!idMessage) return;
    recallMess(idMessage);
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
    recallMessages(recallMessId);
  }, [recallMessId]);

  useEffect(() => {
    if (!isLoadingProfile && lastMessageRef.current && !isScroll) {
      scroll();
      setIsScroll(true);
    }
  }, [messagesByDay, isLoadingProfile]);
  useEffect(() => {
    if (!containerRefMess?.current) return;

    let timeoutId; // Biến để lưu `setTimeout`

    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } =
        containerRefMess?.current;
      if ((scrollTop, scrollHeight, clientHeight === undefined)) return;
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
  const handleShareLink = async (share) => {
    if (!share || !share?.type || !share?.id) {
      return;
    }
    if (share?.type == "comment") {
      const res = await getCmtById(share?.id);
      console.log(res?.post, share?.id);
      setPostId(res?.post);
      setCmtVisible(share?.id);
    } else if (share?.type == "post") {
      setPostId(share?.id);
    } else {
      toast.error("ôi không chúng tôi chưa hỗ trợ");
    }
  };
  const scroll = () => {
    lastMessageRef.current?.scrollIntoView({ behavior: "auto" });
  };
  const handleRecallMessage = async (messageId) => {
    const isConfirmed = await confirm("Bạn có chắc muốn thu hồi tin nhắn này?");
    if (!isConfirmed) return;
    try {
      // Cập nhật UI trước khi gửi request (tùy vào server có yêu cầu chặn thu hồi không)

      // Gửi request thu hồi lên server
      const response = await RecallMessage(messageId);

      if (response.status !== 200) {
        throw new Error("Thu hồi tin nhắn thất bại");
      }
      recallMess(messageId);
      console.log("Thu hồi thành công:", messageId);
    } catch (error) {
      console.error("Lỗi thu hồi tin nhắn:", error);

      // Nếu API thất bại, khôi phục tin nhắn về trạng thái ban đầu
      setMessagesByDay((prev) =>
        prev.map((group) => ({
          ...group,
          mess: group.mess.map((msg) =>
            msg._id === messageId ? { ...msg, isRecalled: false } : msg
          ),
        }))
      );
    }
  };
  const recallMess = async (messageId) => {
    setMessagesByDay((prev) =>
      prev.map((group) => ({
        ...group,
        mess: group.mess.map((msg) =>
          msg._id === messageId
            ? { ...msg, isRecalled: true, content: "Tin nhắn đã bị thu hồi" }
            : msg
        ),
      }))
    );
  };
  const handleEditMessage = async (messageId) => {
    console.log("Chỉnh sửa tin nhắn:", messageId);
    // Hiển thị input cho phép chỉnh sửa tin nhắn
    const isConfirmed = await confirm(
      "ô nô chúng tôi không cho sửa chỉ có xóa ảo hoặc thu hồi thật :)))"
    );
    if (!isConfirmed) return;
    return;
  };

  const handleDeleteMessage = async (messageId) => {
    const isConfirmed = await confirm("Bạn có chắc muốn xóa tin nhắn này?");
    if (!isConfirmed) return;
    if (!messageId) return;
    try {
      const rs = deleteMessage(messageId);
      // console.log(messageId);
      // console.log(messagesByDay);
      setMessagesByDay(
        (prev) =>
          prev
            .map((group) => ({
              ...group,
              mess: group.mess.filter((msg) => msg._id !== messageId),
            }))
            .filter((group) => group.mess.length > 0) // Xóa ngày nếu không còn tin nhắn nào
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };
  if (isLoadingProfile) return <LoadingAnimation />;
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
              const isLastThree =
                group.mess.length > 4 && index >= group.mess.length - 2;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredMessageId(msg._id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                  ref={
                    dayIndex === messagesByDayMemo.length - 1 &&
                    index === group.mess.length - 1
                      ? lastMessageRef
                      : null
                  }
                  className={`flex items-center space-x-2 ${
                    isMe
                      ? "justify-end pl-14 md:pl-0"
                      : "justify-start pr-14 md:pr-0"
                  } mb-2`}
                >
                  <Menu as="div" className="relative ">
                    {hoveredMessageId === msg._id &&
                      !msg?.isRecalled &&
                      (msg?.sender?._id === profile?._id ||
                        msg?.sender === profile?._id) && (
                        <Menu.Button
                          as={IconButton}
                          onClick={() => setOpenMenuId(msg._id)}
                        >
                          <MoreHorizIcon />
                        </Menu.Button>
                      )}
                    {/* Dropdown Menu */}
                    {openMenuId === msg._id && (
                      <Menu.Items
                        className={`absolute right-0 w-40 bg-white shadow-lg rounded-md border border-gray-200 p-1 z-50 origin-bottom-right transform 
                        ${isLastThree ? "bottom-full mb-2" : "top-full mt-2"}`}
                      >
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleRecallMessage(msg._id)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              Thu hồi
                            </button>
                          )}
                        </Menu.Item>
                        {/* <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleEditMessage(msg._id)}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              Chỉnh sửa
                            </button>
                          )}
                        </Menu.Item> */}
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleDeleteMessage(msg._id)}
                              className={`block w-full text-left px-4 py-2 text-sm text-red-500 ${
                                active ? "bg-gray-100" : ""
                              }`}
                            >
                              Xóa
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    )}
                  </Menu>

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
                          {msg?.share?.id && (
                            <>
                              <p className="break-words whitespace-pre-wrap p-2 pb-0">
                                <Button
                                  onClick={() => {
                                    handleShareLink(msg?.share);
                                  }}
                                  className="hover:scale-105 p-2"
                                >
                                  <Search /> Xem ngay{" "}
                                  {msg?.share?.type == "comment"
                                    ? "Bình luận"
                                    : msg?.share?.type == "post"
                                    ? "Bài viết"
                                    : msg?.share?.type}
                                </Button>
                              </p>
                            </>
                          )}
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
