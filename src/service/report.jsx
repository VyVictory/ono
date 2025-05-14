import api from "./components/api";
import { nextError } from "./components/nextLogin";

export const postReport = async ({ postId, commentId, userId, content }) => {
  try {
    let url = "";
    let data = { content };

    if (postId) {
      url = `/report/post/`;
      data.postId = postId;
    } else if (commentId) {
      url = `/report/comment/`;
      data.commentId = commentId;
    } else if (userId) {
      url = `/report/user/`;
      data.userId = userId;
    } else {
      // Không có ID hợp lệ nào
      return null;
    }

    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Report failed:", error);
    return null;
  }
};
export const getReport = async (type) => {
  try {
    const response = await api.get(`/report/admin/?type=${type || "user"}`);
    return response;
  } catch (error) {
    nextError(error);
    return error;
  }
};
export const resolvedReport = async (reportId, type) => {
  try {
    const response = await api.put(`/report/admin/status`, {
      reportId,
      type,
      status: "resolved",
    });
    return response;
  } catch (error) {
    nextError(error);
    return error;
  }
};
export const deleteReport = async (reportId, type) => {
  console.log(reportId, type);
  try {
    const response = await api.delete(`/report/admin/`, {
      data: { reportId: reportId, type: type },
    });
    return response;
  } catch (error) {
    nextError(error);
    return error; // Nếu đây không phải là Express, đổi tên 'res'
  }
};
