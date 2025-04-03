import api from "./components/api";
import authToken from "./storage/authToken";
import res from "./components/res";
import { nextLogin, nextError } from "./components/nextLogin";

const token = authToken.getToken();
export const follow = async (idUser) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.post(`follow/${idUser}`);
    console.log(response.data);
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const unFollow = async (idUser) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.delete(`follow/${idUser}`);
    console.log(response.data);
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};

export const checkFollow = async (idUser) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.get(`follow/check/${idUser}`);
    console.log(response);
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
