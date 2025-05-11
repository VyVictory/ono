import React, { useState, useEffect, useMemo } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";
import {
  Reply as ReplyIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon, // Icon ba chấm dọc
  Send as SendIcon,
  Close as CloseIcon,
  ArrowBack,
} from "@mui/icons-material";
import avt from "../../img/DefaultAvatar.jpg";
import { formatDistanceToNow } from "date-fns";
import viLocale from "date-fns/locale/vi";
import { getCmt, PostComment } from "../../service/cmt";
import { useAuth } from "../../components/context/AuthProvider";
const maxDepthCmt = 3;
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
  const { profile } = useAuth();
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
                  {comment?.user?.id === profile?._id && (
                    <>
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
                    </>
                  )}
                </Menu>
              </div>
            </div>
            <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            {depth >= maxDepthCmt && comment.replies.length > 0 && (
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
        <Paper
          elevation={2}
          className="relative w-full max-w-5xl mx-auto p-3 rounded-xl border border-blue-200 bg-white"
        >
          {replyTo && (
            <div className="absolute -top-4 left-6 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 flex items-center gap-1 shadow-sm">
              <ReplyIcon fontSize="small" />
              Đang phản hồi:{" "}
              <span className="font-semibold">{comment.user.name}</span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Avatar
              src={profile?.avatar || ""}
              className="w-8 h-8 ring-2 ring-blue-200"
            />
            <TextField
              fullWidth
              placeholder={
                replyTo
                  ? `Phản hồi ${comment.user.name}...`
                  : "Viết bình luận..."
              }
              value={text}
              onChange={(e) => setText(e.target.value)}
              size="small"
              variant="standard"
              className=" rounded-full transition-all"
              InputProps={{
                className: "py-1.5 px-4 text-sm",
                style: {
                  height: "38px",
                  borderRadius: "9999px", // full rounded
                },
              }}
            />

            <IconButton
              onClick={handleSubmit}
              disabled={!text.trim()}
              aria-label="send"
              className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-md"
            >
              <SendIcon fontSize="small" />
            </IconButton>
            {replyTo && (
              <IconButton
                onClick={() => setReplyTo(null)}
                aria-label="cancel"
                className="text-gray-400 hover:text-red-500 p-1.5"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        </Paper>
      )}

      {depth < maxDepthCmt &&
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
  const [rootId, setRootId] = useState(null); // ← NEW
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
  const displayTree = useMemo(() => {
    if (!rootId) return tree;
    // find the node in the tree matching rootId
    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.id === rootId) return node;
        const found = findNode(node.replies);
        if (found) return found;
      }
      return null;
    };
    const rootNode = findNode(tree);
    return rootNode ? [rootNode] : [];
  }, [tree, rootId]);
  // when you click “Xem thêm phản hồi”
  const handleViewMore = (id) => {
    setRootId(id);
    // optionally scroll to it:
    setTimeout(() => {
      const el = document.getElementById(`comment-${id}`);
      const container = document.getElementById(`post-${postId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (container)
        container.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  // to go back to the full list
  const clearRoot = () => setRootId(null);
  const handleSubmit = async () => {
    if (!text.trim() || !replyTo.id) return;
    const result = await PostComment({
      postId: postId,
      content: text,
      idCmt: replyTo?.id,
    });
    const newSw = switchData(result);
    setComments([newSw, ...comments]);
    setReplyTo(null);
    setText("");
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

  if (!open) return null;
  return (
    <div className="">
      <h2 className="relative text-xl font-semibold text-gray-400 py-2 w-full text-center border-t flex items-center justify-center">
        {rootId && (
          <button
            onClick={clearRoot}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center text-sm text-gray-500 italic"
          >
            <ArrowBack fontSize="small" className="mr-1" />
            Xem tất cả bình luận
          </button>
        )}
        Bình luận
      </h2>

      <div className="max-h-[68dvh] overflow-y-auto custom-scrollbar md:px-4 px-2">
        {displayTree.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            onReply={setReplyTo}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onViewMore={handleViewMore}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            text={text}
            setText={setText}
            handleSubmit={handleSubmit}
            depth={0}
          />
        ))}
        {displayTree.length === 0 && (
          <p className="text-gray-500 italic text-sm">
            {rootId ? "Không tìm thấy phản hồi." : "Chưa có bình luận nào."}
          </p>
        )}
      </div>

      <div id={`post-${postId}`} className="flex items-center space-x-3 p-2">
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
