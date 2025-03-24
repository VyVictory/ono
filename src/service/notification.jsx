import api from "./components/api";
import authToken from "./storage/authToken";
import res from "./components/res";
import { nextLogin, nextError } from "./components/nextLogin";

const token = authToken.getToken();
export const getNotifications = async ({ start, limit }) => {
  try {
    if (!token) {
      return;
      //   nextLogin();
    }
    const response = await api.get(
      `/noti/notifications/?start=${start}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    // nextError(error);
    return res(error);
  }
};

export const readNotification = async ({ id }) => {
  try {
    if (!token) {
      return;
        // nextLogin();
    }
    const response = await api.put(`/noti/notifications/${id}/read`);
    return response.data;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
