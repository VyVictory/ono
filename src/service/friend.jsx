import api from "./api";
import authToken from "./storage/authToken";
import res from "./res";

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
    return res(error);
  }
};
export const getStatusByIdUser = async (idUser) => {
  try {
    if (!authToken.getToken()) {
      return null;
    }
    const response = await api.get(`/friend/status/${encodeURIComponent(idUser)}`);
    return response.data;
  } catch (error) {
    return res(error);
  }
};
