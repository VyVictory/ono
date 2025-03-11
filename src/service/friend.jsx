import api from "./components/api";
import authToken from "./storage/authToken";
import res from "./components/res";
import { nextLogin, nextError } from "./components/nextLogin";

const token = authToken.getToken();
export const addFriend = async (idUser) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.post("friend/request", {
      recipientId: idUser,
    });
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const acceptedAddFriend = async (idUser) => {
  //request= accepted or other
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.post(
      `friend/respond/${encodeURIComponent(idUser)}`,
      {
        status: "accepted",
      }
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const rejectedAddFriend = async (idUser) => {
  //request= accepted or other
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.post(
      `friend/respond/${encodeURIComponent(idUser)}`,
      {
        status: "rejected",
      }
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const cancelFriendRequest = async (idUser) => {
  //request= accepted or other
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.post(
      `friend/cancelRequest/${encodeURIComponent(idUser)}`
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const getStatusByIdUser = async (idUser) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.get(
      `/friend/status/${encodeURIComponent(idUser)}`
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
