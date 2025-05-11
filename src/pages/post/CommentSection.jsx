import { useState, useEffect, useMemo } from "react";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  ExpandMore,
  ExpandLess,
  ArrowBack,
} from "@mui/icons-material";

import { formatDistanceToNow } from "date-fns";
import viLocale from "date-fns/locale/vi";
import { Avatar, Button, Collapse, TextField } from "@mui/material";
const buildTree = (flat) => {
  const map = {},
    roots = [];
  flat.forEach((c) => (map[c.id] = { ...c, replies: [] }));
  flat.forEach((c) =>
    c.replies && map[c.replies]
      ? map[c.replies].replies.push(map[c.id])
      : roots.push(map[c.id])
  );
  return roots;
};

const findById = (nodes, id) => {
  for (const n of nodes) {
    if (n.id === id) return n;
    const found = findById(n.replies, id);
    if (found) return found;
  }
  return null;
};

const CommentItem = ({
  comment,
  onReply,
  onDelete,
  onEdit,
  depth = 0,
  focusOnThread,
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const toggleReplies = () =>
    depth >= 3 ? focusOnThread(comment) : setShowReplies((p) => !p);

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex space-x-3 mb-4">
      <Avatar src={comment.user.avatar} alt={comment.user.name} />
      <div className="flex-1">
        <div className="bg-gray-100 p-3 rounded-lg relative">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-gray-800 text-sm">
              {comment.user.name}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), {
                locale: viLocale,
                addSuffix: true,
              })}
            </span>
          </div>

          {isEditing ? (
            <>
              <TextField
                multiline
                fullWidth
                size="small"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="mt-2 space-x-2">
                <Button
                  size="small"
                  variant="contained"
                  onClick={handleSaveEdit}
                >
                  Lưu
                </Button>
                <Button size="small" onClick={() => setIsEditing(false)}>
                  Hủy
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center space-x-2 mt-1 ml-2 text-sm text-gray-600">
            {comment.replies.length > 0 && (
              <Button
                size="small"
                onClick={toggleReplies}
                startIcon={
                  depth >= 3 ? (
                    <ArrowBack />
                  ) : showReplies ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                }
              >
                {depth >= 3
                  ? "Xem chuỗi thảo luận"
                  : showReplies
                  ? "Ẩn trả lời"
                  : `Xem trả lời (${comment.replies.length})`}
              </Button>
            )}
            <Button
              size="small"
              onClick={() => onReply(comment)}
              startIcon={<ReplyIcon />}
            >
              Trả lời
            </Button>
            <Button
              size="small"
              onClick={() => setIsEditing(true)}
              startIcon={<EditIcon />}
            >
              Sửa
            </Button>
            <Button
              size="small"
              onClick={() => onDelete(comment.id)}
              startIcon={<DeleteIcon />}
              color="error"
            >
              Xóa
            </Button>
          </div>
        )}

        {depth < 3 && (
          <Collapse in={showReplies} className="ml-8 mt-2">
            {comment.replies.map((rep) => (
              <CommentItem
                key={rep.id}
                comment={rep}
                onReply={onReply}
                onDelete={onDelete}
                onEdit={onEdit}
                depth={depth + 1}
                focusOnThread={focusOnThread}
              />
            ))}
          </Collapse>
        )}
      </div>
    </div>
  );
};

export const CommentSection = ({
  postId,
  open,
  focusCommentId,
  onReplyGlobal,
}) => {
  const [flatComments, setFlatComments] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [focusedThread, setFocusedThread] = useState(null);

  const treeComments = useMemo(() => buildTree(flatComments), [flatComments]);

  useEffect(() => {
    if (focusCommentId) {
      const target = findById(treeComments, focusCommentId);
      if (target) setFocusedThread(target);
    }
  }, [focusCommentId, treeComments]);

  useEffect(() => {
    if (focusedThread) {
      const updated = findById(treeComments, focusedThread.id);
      if (updated) setFocusedThread(updated);
    }
  }, [flatComments, treeComments]);

  useEffect(() => {
    if (!open || !postId) return;
    setFocusedThread(null);
    setFlatComments([
      {
        id: "c1",
        user: { name: "Minh Nguyễn", avatar: "" },
        content: "Bài viết rất hữu ích!",
        createdAt: new Date().toISOString(),
        replies: null,
      },
      {
        id: "c2",
        user: { name: "Hòa", avatar: "" },
        content: "bình luận hữu ích!",
        createdAt: new Date().toISOString(),
        replies: "c1",
      },
      {
        id: "c3",
        user: { name: "Nghĩa", avatar: "" },
        content: "Chào Hòa!",
        createdAt: new Date().toISOString(),
        replies: "c2",
      },
      {
        id: "c4",
        user: { name: "Oo", avatar: "" },
        content: "Chào Nghĩa!",
        createdAt: new Date().toISOString(),
        replies: "c3",
      },
    ]);
  }, [postId, open]);

  const handleSubmit = () => {
    if (!newContent.trim()) return;
    const id = Date.now().toString();
    const parentId = replyTo?.id || null;
    const newCmt = {
      id,
      user: { name: "Bạn", avatar: "" },
      content: newContent,
      createdAt: new Date().toISOString(),
      replies: parentId,
    };
    setFlatComments((prev) => [newCmt, ...prev]);
    setNewContent("");
    setReplyTo(null);
    onReplyGlobal?.(newCmt, parentId);
  };
  const handleDelete = (id) => {
    setFlatComments((prev) => prev.filter((c) => c.id !== id));
  };

  const handleEdit = (id, newContent) => {
    setFlatComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, content: newContent } : c))
    );
  };

  return (
    open && (
      <div className="px-4 py-3">
        <div className="max-h-[100dvh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          {focusedThread ? (
            <>
              <Button
                size="small"
                onClick={() => setFocusedThread(null)}
                className="mb-2"
              >
                ← Quay lại tất cả bình luận
              </Button>
              <CommentItem
                comment={focusedThread}
                onReply={setReplyTo}
                focusOnThread={setFocusedThread}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </>
          ) : (
            treeComments.map((cmt) => (
              <CommentItem
                key={cmt.id}
                comment={cmt}
                onReply={setReplyTo}
                focusOnThread={setFocusedThread}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>

        {replyTo && (
          <div className="text-sm text-gray-600 mb-1">
            Đang trả lời{" "}
            <span className="font-semibold">{replyTo.user.name}</span>
            <button
              className="ml-2 text-red-500"
              onClick={() => setReplyTo(null)}
            >
              Hủy
            </button>
          </div>
        )}

        <div className="flex items-center space-x-2 border-t pt-3">
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder={replyTo ? "Viết trả lời..." : "Viết bình luận..."}
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Gửi
          </Button>
        </div>
      </div>
    )
  );
};
