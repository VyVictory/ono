import api from "./auth";
import { nextError, nextLogin } from "./components/nextLogin";

export const like = async (type, refId, isLike) => {
  try {
    const response = await api.post(`/like/like`, {
      type: type,
      refId: refId,
      isLike: isLike,
    });
    return response;
  } catch (error) {
    nextError(error);
    return error;
  }
};
export const unLike = async (type, refId) => {
  try {
    const response = await api.post(`/like/unlike`, {
      type: type,
      refId: refId,
    });
    return response;
  } catch (error) {
    nextError(error);
    return error;
  }
};
export const checkLike = async (type, refId) => {
  try {
    const response = await api.post(`/like/check`, {
      type: type,
      refId: refId,
    });
    return response;
  } catch (error) {
    nextError(error);
    return error;
  }
};
export const checkCount = async (type, refId) => {
  try {
    const response = await api.post(`/like/count`, {
      type: type,
      refId: refId,
    });
    return response.data;
  } catch (error) {
    nextError(error);
    return error;
  }
};
