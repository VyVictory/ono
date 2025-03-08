import api from "./api";
import authToken from "./storage/authToken";
export const addFriend = async (idUser) => {
  try {
    if (!authToken.getToken()) {
      return null;
    }
    const response = await api.post("friend/request", {
      recipientId: idUser,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      return { message: "Lỗi kết nối" };
    }
  }
};
