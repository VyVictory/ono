import api from "./components/api";
import authToken from "./storage/authToken";
import { nextLogin, nextError } from "./components/nextLogin";

export const PostComment = async ({
  postId,
  content,
  files,
  video,
  idCmt = null,
}) => {
  try {
    const token = authToken.getToken();
    if (!token) {
      nextLogin();
      return null;
    }

    if (!content && (!files || files.length === 0) && !video) return null;
    const formData = new FormData();

    formData.append("content", content?.trim() || "");

    if (idCmt) {
      formData.append("idCmt", idCmt);
    }

    if (files?.length) {
      files.forEach((file) => {
        formData.append("media", file);
      });
    }

    if (video) {
      formData.append("media", video); // Nếu video là 1 File object
    }

    const response = await api.post(`/cmt/${postId}/comment`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    nextError(error);
    return null;
  }
};

export const getCmt = async ({ postId, start, limit }) => {
  try {
    const response = await api.get(
      `/cmt/byPost/${postId}?page=${start || 1}&limit=${limit || Infinity}`
    );
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const getCmtById = async (commentId) => {
  try {
    const response = await api.get(`/cmt/${commentId}`);
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const deleteCmt = async (cmtId) => {
  try {
    const response = await api.delete(`/cmt/${cmtId}`);
    return response;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const hiddenCmt = async (cmtId) => {
  try {
    const response = await api.put(`/cmt/hidden/${cmtId}`);
    return response;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const UpdateComment = async ({ commentId, content, files, video }) => {
  try {
    const token = authToken.getToken();
    if (!token) {
      nextLogin();
      return null;
    }

    if (!content && (!files || files.length === 0) && !video) return null;
    const formData = new FormData();

    formData.append("content", content?.trim() || "");

    if (files?.length) {
      files.forEach((file) => {
        formData.append("media", file);
      });
    }

    if (video) {
      formData.append("media", video); // Nếu video là 1 File object
    }

    const response = await api.put(`/cmt/${commentId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    nextError(error);
    return null;
  }
};
