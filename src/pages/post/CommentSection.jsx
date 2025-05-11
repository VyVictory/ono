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
import {
  deleteCmt,
  getCmt,
  PostComment,
  UpdateComment,
} from "../../service/cmt";
import { useAuth } from "../../components/context/AuthProvider";
import { FaThumbsUp } from "react-icons/fa";
import { toast } from "react-toastify";
import { useConfirm } from "../../components/context/ConfirmProvider";

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
  const [maxDepthCmt, setMaxDepthCmt] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        if (maxDepthCmt === 4) return;
        setMaxDepthCmt(4);
      } else {
        if (maxDepthCmt === 3) return;
        setMaxDepthCmt(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="">
      <div className="flex items-start space-x-3">
        {Array.from({ length: depth }).map((_, i) => (
          <div
            key={i}
            className="w-[10px] sm:w-4 md:w-6 lg:w-8 flex-shrink-0"
          />
        ))}

        <div
          id={"comment-" + comment?.id}
          className="w-full flex flex-col border-t border-gray-200 py-2"
        >
          <div className="flex items-start space-x-3">
            <Avatar
              src={comment.user.avatar}
              className="w-9 h-9 ring-1 ring-blue-100"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-semibold text-gray-900">
                  {comment.user.name}
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    •{" "}
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      locale: viLocale,
                      addSuffix: true,
                    })}
                  </span>
                </div>

                {comment.user.id === profile?._id && (
                  <div>
                    <IconButton
                      size="small"
                      onClick={handleClick}
                      className="text-gray-400 hover:text-gray-700"
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
                )}
              </div>

              <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          </div>

          <div className="flex flex-row ml-10">
            <div className="ml-2 mt-2 text-gray-500 text-sm cursor-pointer flex items-center gap-1 hover:underline">
              <FaThumbsUp fontSize="medium" />
            </div>
            <div className="ml-2 mt-2 text-blue-500 text-sm cursor-pointer flex items-center gap-1 hover:underline">
              <ReplyIcon fontSize="small" />
              <button onClick={() => onReply(comment)}>Trả lời</button>
            </div>
          </div>
          {depth >= maxDepthCmt && comment.replies.length > 0 && (
            <div className="ml-12 mt-2">
              <button
                onClick={() => onViewMore(comment.id)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Xem thêm phản hồi
              </button>
            </div>
          )}
        </div>
      </div>

      {replyTo?.id === comment.id && (
        <Paper
          elevation={2}
          className="relative mt-2 max-w-3xl p-3 rounded-xl border border-blue-100 bg-blue-50"
        >
          <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-blue-300 rounded-full text-xs text-blue-700 flex items-center gap-1 shadow-sm">
            <ReplyIcon fontSize="small" />
            Đang phản hồi:{" "}
            <span className="font-semibold">{comment.user.name}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Avatar
              src={profile?.avatar || ""}
              className="w-8 h-8 ring-2 ring-blue-200"
            />
            <TextField
              fullWidth
              placeholder={`Phản hồi ${comment.user.name}...`}
              value={text}
              onChange={(e) => setText(e.target.value)}
              size="small"
              variant="standard"
              className="rounded-full"
              InputProps={{
                className: "py-1.5 px-4 text-sm",
                style: {
                  height: "38px",
                  borderRadius: "9999px",
                  backgroundColor: "#fff",
                  border: "none",
                },
              }}
            />
            <IconButton
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-md"
            >
              <SendIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => setReplyTo(null)}
              className="text-gray-400 hover:text-red-500 p-1.5"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
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
            maxDepthCmt={maxDepthCmt}
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
  const confirm = useConfirm(); // Sửa lại như trong AddFriend

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
    }, 500); // Đặt thời gian chờ để DOM cập nhật
  }, [open, comments]);
  useEffect(() => {
    if (!postId) return;

    const fetchData = async () => {
      try {
        const res = await getCmt({ postId }); // Gọi API
        if (res?.comments) {
          const transformed = res.comments.map((c) => switchData(c));
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
  const clearRoot = () => {
    setRootId(null);
    setTimeout(() => {
      const container = document.getElementById(`post-${postId}`);
      if (container)
        container.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };
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
    setTimeout(() => {
      const el = document.getElementById(`comment-${newSw?.id}`);
      const container = document.getElementById(`post-${postId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      if (container)
        container.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };
  const handleDelete = async (id) => {
    const isConfirmed = await confirm(
      "Bạn có chắc muốn xóa bình luận này chứ?"
    );
    if (!isConfirmed) return;
    try {
      const res = await deleteCmt(id);
      if (res.status === 200 || res.status === 201) {
        toast.success("Đã xóa bình luận thành công");
        setComments((c) => c.filter((x) => x.id !== id));
      } else {
        toast.error("Không thể xóa bình luận này");
      }
    } catch (error) {
      toast.error("lỗi khi xóa bình luận này");
    }
  };
  const handleEdit = async (comment) => {
    const newText = prompt("Chỉnh sửa bình luận", comment.content);
    try {
      const res = await UpdateComment({
        commentId: comment?.id,
        content: newText,
        // files,
        // video,
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("Đã sửa bình luận thành công");
        if (newText != null)
          setComments((c) =>
            c.map((x) => (x.id === comment.id ? { ...x, content: newText } : x))
          );
      } else {
        toast.error("Không thể sửa bình luận này");
      }
    } catch (error) {
      toast.error("lỗi khi sửa bình luận này");
    }
  };

  if (!open) return null;
  return (
    <div className="">
      {rootId ? (
        <button
          onClick={clearRoot}
          className=" flex items-center text-sm text-gray-500 italic p-2 md:p-3"
        >
          <ArrowBack fontSize="small" className="mr-1" />
          Xem tất cả bình luận
        </button>
      ) : (
        <h2 className="relative text-xl font-semibold text-gray-400 py-2 w-full text-center border-t flex items-center justify-center">
          {" "}
          Bình luận
        </h2>
      )}
      <div className="max-h-[68dvh] overflow-y-auto pb-2 custom-scrollbar md:px-4 px-2">
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
