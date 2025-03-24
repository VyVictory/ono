const getTimeAgo = (timestamp) => {
  const now = new Date();
  const messageTime = new Date(timestamp);
  const diffInSeconds = Math.floor((now - messageTime) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "Vừa xong"; // Just now
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`; // X minutes ago
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`; // X hours ago
  } else {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return messageTime.toLocaleDateString("vi-VN", options); // Format date in Vietnamese
  }
};

export default getTimeAgo;
