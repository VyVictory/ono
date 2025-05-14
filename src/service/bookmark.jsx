import api from "./components/api";
import { nextLogin, nextError } from "./components/nextLogin";

export const getBookmark = async () => {
  try {
    const response = await api.get(`/bookmark`);
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const deleteBookmark = async (postId) => {
  try {
    const response = await api.delete(`/bookmark/${postId}`);
    return response;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const createBookmark = async (postId) => {
  try {
    const response = await api.post(`/bookmark/${postId}`);
    return response;
  } catch (error) {
    // return một đối tượng có cùng cấu trúc như response để xử lý thống nhất
    return {
      status: error.response?.status || 500,
      data: error.response?.data || { message: "Lỗi không xác định" },
    };
  }
};
