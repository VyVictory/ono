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
import { formatDistanceToNow } from "date-fns";
import viLocale from "date-fns/locale/vi";

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
            <span className="text-gray-500">Đang phản hồi:</span> {comment.user.name}
          </div>
          <div className="flex items-start border-x-2 border-blue-100 p-3 pr-0 rounded-lg">
            <Avatar
              src="https://i.pravatar.cc/300?u=you"
              className="w-8 h-8 mr-2"
            />
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
  useEffect(() => {
    if (!open) return;
    // TODO: Replace with API call
    setComments(dataCMT);
  }, [open]);

  const tree = useMemo(() => buildTree(comments), [comments]);

  const handleSubmit = () => {
    if (!text.trim()) return;
    let id = Date.now().toString();
    const newCmt = {
      id: id,
      parentId: replyTo?.id || null,
      user: { name: "Bạn", avatar: "https://i.pravatar.cc/300?u=you" },
      content: text,
      createdAt: new Date().toISOString(),
    };
    setComments([newCmt, ...comments]);
    setText("");
    setReplyTo(null);
    handleViewMore(id);
  };
  const handleSubmitCmt = () => {
    if (!cmt.trim()) return;
    let id = Date.now().toString();
    const newCmt = {
      id: id,
      parentId: null,
      user: { name: "Bạn", avatar: "https://i.pravatar.cc/300?u=you" },
      content: cmt,
      createdAt: new Date().toISOString(),
    };
    setComments([newCmt, ...comments]);
    setCMT("");
    handleViewMore(id);
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
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar mb-4 md:px-4 px-2">
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

      <div className="flex items-center space-x-3 p-2 ">
        <Avatar src="https://i.pravatar.cc/300?u=you" className="w-8 h-8" />
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

const dataCMT = [
  {
    id: "1",
    parentId: null,
    user: { name: "Alice", avatar: "https://i.pravatar.cc/300?u=alice" },
    content: "Chào mọi người! Bài viết này thật thú vị.",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 ngày trước
  },
  {
    id: "2",
    parentId: "1",
    user: { name: "Bob", avatar: "https://i.pravatar.cc/300?u=bob" },
    content: "Tôi hoàn toàn đồng ý với bạn!",
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1 ngày rưỡi trước
  },
  {
    id: "22",
    parentId: "2",
    user: { name: "Bob", avatar: "https://i.pravatar.cc/300?u=bob" },
    content: "Tôi hoàn toàn đồng ý với bạn!",
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1 ngày rưỡi trước
  },
  {
    id: "222",
    parentId: "22",
    user: { name: "Bob", avatar: "https://i.pravatar.cc/300?u=bob" },
    content: "Tôi hoàn toàn đồng ý với bạn!",
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(), // 1 ngày rưỡi trước
  },
  {
    id: "2222",
    parentId: "222",
    user: { name: "Charlie", avatar: "https://i.pravatar.cc/300?u=charlie" },
    content: "Có ai biết thêm về chủ đề này không?",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 ngày trước
  },
  {
    id: "4",
    parentId: "3",
    user: { name: "Alice", avatar: "https://i.pravatar.cc/300?u=alice" },
    content: "Tôi đã đọc một bài báo khác về nó, rất hay.",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 tiếng trước
  },
  {
    id: "5",
    parentId: null,
    user: { name: "David", avatar: "https://i.pravatar.cc/300?u=david" },
    content: "Cảm ơn vì bài viết!",
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 tiếng trước
  },
  {
    id: "6",
    parentId: "5",
    user: { name: "Eve", avatar: "https://i.pravatar.cc/300?u=eve" },
    content: "Tôi cũng thấy nó rất hữu ích.",
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 tiếng trước
  },
  {
    id: "7",
    parentId: null,
    user: { name: "Frank", avatar: "https://i.pravatar.cc/300?u=frank" },
    content: "Mong chờ những bài viết tiếp theo!",
    createdAt: new Date(Date.now() - 1800000 * 1).toISOString(), // 30 phút trước
  },
  {
    id: "8",
    parentId: "7",
    user: { name: "Grace", avatar: "https://i.pravatar.cc/300?u=grace" },
    content: "Tôi cũng vậy!",
    createdAt: new Date(Date.now() - 60000 * 15).toISOString(), // 15 phút trước
  },
  {
    id: "9",
    parentId: null,
    user: { name: "Heidi", avatar: "https://i.pravatar.cc/300?u=heidi" },
    content: "Đây là một cộng đồng tuyệt vời.",
    createdAt: new Date().toISOString(), // Bây giờ
  },
  {
    id: "10",
    parentId: "9",
    user: { name: "Ivan", avatar: "https://i.pravatar.cc/300?u=ivan" },
    content: "Tôi rất vui khi tham gia.",
    createdAt: new Date(Date.now() - 60000 * 5).toISOString(), // 5 phút trước
  },
];
