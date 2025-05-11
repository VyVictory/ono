import React, { useState, useEffect, useMemo } from "react";
import { Avatar, IconButton, Menu, MenuItem, TextField } from "@mui/material";
import {
  Reply as ReplyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon, // Icon ba chấm dọc
  Send as SendIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import avt from "../../img/DefaultAvatar.jpg";
import { formatDistanceToNow } from "date-fns";
import viLocale from "date-fns/locale/vi";
import { getCmt, PostComment } from "../../service/cmt";
import { useAuth } from "../../components/context/AuthProvider";

const CommentItem = ({
  comment,
  onReply,
  onDelete,
  onEdit,
  depth = 0,
  onViewMore,
  replyTo,
  setReplyTo,
  text,
  setText,
  handleSubmit,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={``}>
      <div className={` flex flex-row items-start space-x-4 `}>
        {Array.from({ length: depth }).map((_, i) => (
          <div key={i} className="w-2 sm:w-4 md:w-8 lg:w-10 flex-shrink-0" />
        ))}
        <div className="flex  w-full items-start space-x-4 border-t border-gray-200 py-3">
          <Avatar src={comment.user.avatar} className="w-10 h-10" />
          <div className="flex-1">
            <div
              id={`comment-${comment.id}`}
              className="flex justify-between items-center mb-1"
            >
              <div className="text-sm font-medium text-gray-900">
                {comment.user.name}
                <span className="ml-2 text-gray-500 font-normal">
                  •{" "}
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    locale: viLocale,
                    addSuffix: true,
                  })}
                </span>
              </div>
              <div>
                <IconButton
                  size="small"
                  onClick={handleClick}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="more options"
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                  <MenuItem
                    onClick={() => {
                      onReply(comment);
                      handleClose();
                    }}
                  >
                    <ReplyIcon fontSize="small" className="mr-2" /> Trả lời
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onEdit(comment);
                      handleClose();
                    }}
                  >
                    <EditIcon fontSize="small" className="mr-2" /> Chỉnh sửa
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      onDelete(comment.id);
                      handleClose();
                    }}
                  >
                    <DeleteIcon fontSize="small" className="mr-2" /> Xóa
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            {depth >= 2 && comment.replies.length > 0 && (
              <button
                onClick={() => onViewMore(comment.id)}
                className="text-blue-500 text-sm font-semibold mt-2"
              >
                Xem thêm phản hồi
              </button>
            )}
          </div>
        </div>
      </div>
      {replyTo?.id === comment.id && (
        <div className="mt-2 relative">
          {/* Nhãn Đang phản hồi xuất hiện trên đường viền */}
          <div className="absolute -top-2 left-4 bg-white px-2 text-sm text-blue-500">
            <span className="text-gray-500">Đang phản hồi:</span>{" "}
            {comment.user.name}
          </div>
          <div className="flex items-start border-x-2 border-blue-100 p-3 pr-0 rounded-lg">
            <Avatar src={comment.user.avatar || ""} className="w-8 h-8 mr-2" />
            <TextField
              fullWidth
              placeholder={`Phản hồi ${comment.user.name}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              size="small"
              variant="outlined"
              className="flex-grow"
            />
            <IconButton
              onClick={handleSubmit}
              disabled={!text.trim()}
              color="primary"
              aria-label="send reply"
            >
              <SendIcon />
            </IconButton>
            <IconButton
              onClick={() => setReplyTo(null)}
              aria-label="cancel reply"
              className="text-gray-400 hover:text-red-500"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </div>
      )}

      {depth < 2 &&
        comment.replies.map((child) => (
          <CommentItem
            key={child.id}
            comment={child}
            onReply={onReply}
            onDelete={onDelete}
            onEdit={onEdit}
            onViewMore={onViewMore}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            text={text}
            setText={setText}
            handleSubmit={handleSubmit}
            depth={depth + 1}
          />
        ))}
    </div>
  );
};

// Build flat array to tree (giữ nguyên)
const buildTree = (flat) => {
  console.log(flat);
  const map = {},
    roots = [];
  flat.forEach((c) => (map[c.id] = { ...c, replies: [] }));
  flat.forEach((c) =>
    c.parentId && map[c.parentId]
      ? map[c.parentId].replies.push(map[c.id])
      : roots.push(map[c.id])
  );
  return roots;
};

export const CommentSection = ({ postId, open, cmtId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [cmt, setCMT] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const { profile } = useAuth();
  useEffect(() => {
    setTimeout(() => {
      if (open && comments) {
        const element = document.getElementById(`post-${postId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
        }
      }
    }, 100); // Đặt thời gian chờ để DOM cập nhật
  }, [open, comments]);
  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      try {
        const res = await getCmt({ postId }); // Gọi API
        console.log("data nguyen", res);
        if (res?.comments) {
          const transformed = res.comments.map((c) => switchData(c));
          console.log("setData");
          setComments(transformed);
        }
      } catch (error) {
        console.error("Lỗi khi lấy bình luận:", error);
      }
    };

    fetchData(); // Gọi hàm async
  }, [postId]);
  const tree = useMemo(() => buildTree(comments), [comments]);

  const handleSubmit = async () => {
    if (!text.trim() || !replyTo.id) return;
    const result = await PostComment({
      postId: postId,
      content: text,
      idCmt: replyTo?.id,
    });

    const newSw = switchData(result);
    console.log("add", newSw);
    // setComments([newSw, ...comments]);

    // const newCmt = {
    //   id: id,
    //   parentId: replyTo?.id || null,
    //   user: { name: "Bạn", avatar: "https://i.pravatar.cc/300?u=you" },
    //   content: text,
    //   createdAt: new Date().toISOString(),
    // };
    setComments([newSw, ...comments]);
    setReplyTo(null);
    setText("");
    handleViewMore(newSw?.id);
  };
  const handleSubmitCmt = async () => {
    if (!cmt.trim() || !postId) return;

    const result = await PostComment({
      postId: postId,
      content: cmt,
    });
    setCMT("");
    const newSw = switchData(result);
    setComments([newSw, ...comments]);
    handleViewMore(newSw?.id);
  };
  const handleDelete = (id) => setComments((c) => c.filter((x) => x.id !== id));
  const handleEdit = (comment) => {
    const newText = prompt("Chỉnh sửa bình luận", comment.content);
    if (newText != null)
      setComments((c) =>
        c.map((x) => (x.id === comment.id ? { ...x, content: newText } : x))
      );
  };
  const handleViewMore = (id) => {
    setTimeout(() => {
      const element = document.getElementById(`comment-${id}`);
      if (element) {
        console.log("Element found:", element);
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.log("Element not found", `comment-${id}`);
      }
    }, 100); // Đặt thời gian chờ để DOM cập nhật
  };

  if (!open) return null;
  return (
    <div className="">
      <h2 className="text-xl font-semibold text-gray-400 py-2 w-full text-center border-t">
        Bình luận
      </h2>
      <div className="max-h-[68dvh] overflow-y-auto custom-scrollbar mb-4 md:px-4 px-2">
        {tree.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            onReply={setReplyTo}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onViewMore={(id) => {
              handleViewMore(id);
            }}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            text={text}
            setText={setText}
            handleSubmit={handleSubmit}
            depth={0}
          />
        ))}
        {tree.length === 0 && (
          <p className="text-gray-500 italic text-sm">Chưa có bình luận nào.</p>
        )}
      </div>

      <div id={`post-${postId}`} className="flex items-center space-x-3 p-2 ">
        <Avatar src={profile?.avatar || " "} className="w-8 h-8" />

        <TextField
          fullWidth
          placeholder="Thêm bình luận..."
          value={cmt}
          onChange={(e) => setCMT(e.target.value)}
          size="small"
          variant="outlined"
          className="flex-grow"
        />
        <IconButton
          onClick={handleSubmitCmt}
          disabled={!cmt.trim()}
          color="primary"
          aria-label="send comment"
        >
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
};

const switchData = (data) => {
  return {
    id: data._id,
    post: data?.post,
    parentId: data.idCmt,
    user: {
      id: data?.author?._id,
      avatar: data?.author?.avatar || avt,
      name: data?.author?.firstName + " " + data?.author?.lastName,
    },
    content: data.content,
    reactionCounts: data?.reactionCounts,
    mentions: data?.mentions,
    media: data?.media?.media,
    hashtags: data?.hashtags,
    updatedAt: data?.updatedAt,
    createdAt: data.createdAt,
  };
};
