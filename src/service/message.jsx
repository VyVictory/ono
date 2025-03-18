import api from "./components/api";
import authToken from "./storage/authToken";
import { nextLogin, nextError } from "./components/nextLogin";
const token = authToken.getToken();
export const SendToUser = async (id, message, file) => {
  try {
    if (!token) {
      nextLogin();
    }
    const formData = new FormData();
    formData.append("content", message);
    console.log(formData);
    const response = await api.post(
      `/message/send/${encodeURIComponent(id)}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    nextError(error);
    return null;
  }
};
export const getMessageInbox = async (id, start, limit) => {
  try {
    const response = await api.get( 
      `/message/inbox/rage/${id}?start=${start}&limit=${limit}`
    ); 
    return response.data;
  } catch (error) {
    nextError(error);
    return null;
  }
};
