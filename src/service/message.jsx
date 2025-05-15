import api from "./components/api";
import authToken from "./storage/authToken";
import { nextLogin, nextError } from "./components/nextLogin";
import { useSocket } from "./socket/socket";
import { useAuth } from "../components/context/AuthProvider";
const token = authToken.getToken();

export const SendToUser = async (id, message, files) => {
  try {
    if (!token) {
      nextLogin();
    }
    const formData = new FormData();
    formData.append("content", message);
    if (files && files.length > 0) {
      files.forEach((file) => {
        console.log("Adding file:", file.name); // Debug xem file có đúng không
        formData.append("media", file); // Append từng file một
      });
    }

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
export const shareMess = async ({ id, type, useId }) => {
  try {
    if (!token) {
      nextLogin();
      return;
    }
    if (!id) {
      console.log("post thieu id");
      return;
    }
    const data = { type: type, id: id };
    const response = await api.post(`/message/share/${useId}`, data);
    return response;
  } catch (error) {
    nextError(error);
    return null;
  }
};

export const editMess = async (id, message, files) => {
  try {
    if (!token) {
      nextLogin();
    }
    const formData = new FormData();
    formData.append("content", message);
    if (files && files.length > 0) {
      files.forEach((file) => {
        console.log("Adding file:", file.name); // Debug xem file có đúng không
        formData.append("media", file); // Append từng file một
      });
    }

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
export const RecallMessage = async (id) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.post(
      `/message/${encodeURIComponent(id)}/recall`
    );
    return response;
  } catch (error) {
    nextError(error);
    return null;
  }
};
export const deleteMessage = async (id) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.delete(`/message/${id}`);
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
