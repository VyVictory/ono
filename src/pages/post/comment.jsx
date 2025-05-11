import { useState, useEffect, useMemo } from "react";
import { Avatar, Button, TextField, Collapse } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import viLocale from "date-fns/locale/vi";

// Utility: convert flat list to nested tree
const buildTree = (flatComments) => {
  const map = {};
  const roots = [];

  flatComments.forEach((c) => {
    map[c.id] = { ...c, replies: [] };
  });
  flatComments.forEach((c) => {
    if (c.replies && map[c.replies]) {
      map[c.replies].replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });
  return roots;
};

const CommentItem = ({ comment, onReply, depth = 0, focusOnThread }) => {
  const [showReplies, setShowReplies] = useState(false);
  const handleToggleReplies = () => {
    if (depth >= 3) focusOnThread(comment);
    else setShowReplies((p) => !p);
  };

  return (
    <div className="flex space-x-3 mb-4">
      <Avatar src={comment.user.avatar} alt={comment.user.name} />
      <div className="flex-1">
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-gray-800 text-sm">{comment.user.name}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { locale: viLocale, addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
        </div>
        <div className="flex items-center space-x-2 mt-1 ml-2">
          {comment.replies.length > 0 && (
            <Button size="small" onClick={handleToggleReplies}>
              {depth >= 3
                ? "Xem chuỗi thảo luận"
                : showReplies
                ? "Ẩn trả lời"
                : `Xem trả lời (${comment.replies.length})`}
            </Button>
          )}
          <Button size="small" onClick={() => onReply(comment)}>Trả lời</Button>
        </div>
        {depth < 3 && (
          <Collapse in={showReplies} className="ml-8 mt-2">
            {comment.replies.map((rep) => (
              <CommentItem key={rep.id} comment={rep} onReply={onReply} depth={depth + 1} focusOnThread={focusOnThread} />
            ))}
          </Collapse>
        )}
      </div>
    </div>
  );
}; 
export const CommentSection = ({ postId, open, focusCommentId, onReplyGlobal }) => {
  const [flatComments, setFlatComments] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [focusedThread, setFocusedThread] = useState(null);

  // Build nested comments
  const treeComments = useMemo(() => buildTree(flatComments), [flatComments]);

  // Sync focusedThread when flatComments change or focusCommentId prop change
  useEffect(() => {
    if (focusCommentId) {
      const findById = (nodes, id) => {
        for (const n of nodes) {
          if (n.id === id) return n;
          const found = findById(n.replies, id);
          if (found) return found;
        }
        return null;
      };
      const target = findById(treeComments, focusCommentId);
      if (target) setFocusedThread(target);
    }
  }, [focusCommentId, treeComments]);

  // Keep focusedThread updated on replies
  useEffect(() => {
    if (focusedThread) {
      const findById = (nodes, id) => {
        for (const n of nodes) {
          if (n.id === id) return n;
          const found = findById(n.replies, id);
          if (found) return found;
        }
        return null;
      };
      const updated = findById(treeComments, focusedThread.id);
      if (updated) setFocusedThread(updated);
    }
  }, [flatComments, treeComments, focusedThread]);

  useEffect(() => {
    if (!open || !postId) return;
    setFocusedThread(null);
    // TODO: fetch flat comments
    setFlatComments([
      { id: "c1", user: { name: "Minh Nguyễn", avatar: "" }, content: "Bài viết rất hữu ích!", createdAt: new Date().toISOString(), replies: null },
      { id: "c2", user: { name: "Hòa", avatar: "" }, content: "bình luận hữu ích!", createdAt: new Date().toISOString(), replies: "c1" },
      { id: "c3", user: { name: "Nghĩa", avatar: "" }, content: "Chào Hòa!", createdAt: new Date().toISOString(), replies: "c2" },
      { id: "c4", user: { name: "Oo", avatar: "" }, content: "Chào Nghĩa!", createdAt: new Date().toISOString(), replies: "c3" },
    ]);
  }, [postId, open]);

  const handleSubmit = () => {
    if (!newContent.trim()) return;
    const id = Date.now().toString();
    const parentId = replyTo ? replyTo.id : null;
    const newCmt = { id, user: { name: "Bạn", avatar: "" }, content: newContent, createdAt: new Date().toISOString(), replies: parentId };
    setFlatComments((prev) => [newCmt, ...prev]);
    setNewContent("");
    setReplyTo(null);
    // Optional callback
    onReplyGlobal?.(newCmt, parentId);
  };

  const handleBackToAll = () => setFocusedThread(null);

  return (
    open && (
      <div className="px-4 py-3">
        <div className="max-h-[100dvh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
          {focusedThread ? (
            <>
              <Button size="small" onClick={handleBackToAll} className="mb-2">← Quay lại tất cả bình luận</Button>
              <CommentItem comment={focusedThread} onReply={setReplyTo} depth={0} focusOnThread={setFocusedThread} />
            </>
          ) : (
            treeComments.map((cmt) => (
              <CommentItem key={cmt.id} comment={cmt} onReply={setReplyTo} depth={0} focusOnThread={setFocusedThread} />
            ))
          )}
        </div>

        {replyTo && (
          <div className="text-sm text-gray-600 mb-1">
            Đang trả lời <span className="font-semibold">{replyTo.user.name}</span>
            <button className="ml-2 text-red-500" onClick={() => setReplyTo(null)}>Hủy</button>
          </div>
        )}
        <div className="flex items-center space-x-2 border-t pt-3">
          <TextField fullWidth size="small" variant="outlined" placeholder={replyTo ? "Viết trả lời..." : "Viết bình luận..."} value={newContent} onChange={(e) => setNewContent(e.target.value)} />
          <Button variant="contained" onClick={handleSubmit}>Gửi</Button>
        </div>
      </div>
    )
  );
};
