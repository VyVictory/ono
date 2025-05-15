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
export const getFriendsMess = async (start, limit, name) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.get(
      `/friend/friends/mess/?start=${start}&limit=${limit}&name=${name}`
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const getFriends = async (start, limit, name) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.get(
      `/friend/friends/?startIndex=${start}&limitCount=${Infinity}&name=${name}`
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const getFriendById = async (start, limit, name, id) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.get(
      `/friend/friends/friendByid/${id}?startIndex=${start}&limitCount=${limit}&name=${name}`
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const unFriend = async (idUser) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.delete(
      `/friend/unfriend/${encodeURIComponent(idUser)}`
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
