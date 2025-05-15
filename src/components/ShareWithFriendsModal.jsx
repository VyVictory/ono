import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
  CircularProgress,
  IconButton,
  InputAdornment,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { getFriends } from "../service/friend";
import { shareMess } from "../service/message";
import debounce from "lodash/debounce";

const ShareWithFriendsModal = ({ open, onClose }) => {
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState(new Set());
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Định nghĩa debounce fetchFriends ngoài useEffect để tránh recreate mỗi lần
  const fetchFriendsDebounced = useCallback(
    debounce(async (query) => {
      setLoading(true);
      try {
        const res = await getFriends(0, 1000, query);
        setFriends(res?.data?.friends || []);
      } catch (error) {
        console.error("Failed to fetch friends", error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Effect gọi API khi modal mở và search thay đổi
  useEffect(() => {
    if (open) {
      fetchFriendsDebounced(search);
    } else {
      // Reset khi modal đóng
      setFriends([]);
      setSelectedFriends(new Set());
      setSearch("");
      setLoading(false);
    }
    // Cleanup khi unmount
    return () => {
      fetchFriendsDebounced.cancel();
    };
  }, [open, search, fetchFriendsDebounced]);

  const toggleSelect = (id) => {
    setSelectedFriends((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleShare = async () => {
    if (selectedFriends.size === 0) return;
    setLoading(true);
    console.log(open);
    try {
      await Promise.all(
        Array.from(selectedFriends).map((useId) =>
          shareMess({ id: open?.id, type: open?.type, useId })
        )
      );
      onClose();
    } catch (error) {
      console.error("Error sharing message:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setSearch("");
  };

  const selectedCount = useMemo(() => selectedFriends.size, [selectedFriends]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Chia sẻ với bạn bè
        <IconButton
          size="small"
          onClick={toggleSearch}
          sx={{ float: "right" }}
          aria-label={showSearch ? "Ẩn tìm kiếm" : "Hiện tìm kiếm"}
        >
          {showSearch ? (
            <ArrowUpTrayIcon className="w-5 h-5" />
          ) : (
            <SearchIcon />
          )}
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {showSearch && (
          <TextField
            autoFocus
            placeholder="Tìm kiếm bạn bè"
            fullWidth
            margin="dense"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px 0",
            }}
          >
            <CircularProgress />
          </div>
        ) : friends.length === 0 ? (
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mt: 3 }}
          >
            Không tìm thấy bạn bè
          </Typography>
        ) : (
          <List sx={{ maxHeight: 350, overflowY: "auto" }}>
            {friends.map(({ _id, avatar, firstName, lastName }) => {
              const checked = selectedFriends.has(_id);
              return (
                <ListItem
                  key={_id}
                  button
                  onClick={() => toggleSelect(_id)}
                  selected={checked}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      onChange={() => toggleSelect(_id)}
                    />
                  }
                >
                  <ListItemAvatar>
                    <Avatar src={avatar} alt={`${firstName} ${lastName}`} />
                  </ListItemAvatar>
                  <ListItemText primary={`${firstName} ${lastName}`} />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleShare}
          disabled={loading || selectedCount === 0}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? "Đang gửi..." : `Gửi (${selectedCount})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareWithFriendsModal;
