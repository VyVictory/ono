import api from "./components/api";
import authToken from "./storage/authToken";
import { nextLogin, nextError } from "./components/nextLogin";
import { useSocket } from "./socket/socket";
import { useAuth } from "../components/context/AuthProvider";
const token = authToken.getToken();

export const getAllUser = async ({ page, limit, search }) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.get(
      `/user/admin/users?page=${page}&limit=${limit}&search=${search}`
    );
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const getAllPost = async ({ page, limit, search }) => {
  try {
    const response = await api.get(
      `/post/all/?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const getAllCmt = async ({ page, limit, search }) => {
  try {
    const response = await api.get(
      `/cmt/admin/all/?page=${page}&limit=${limit}&search=${search}`
    );
    return response.data;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const deleteUser = async (userId) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.delete(`/user/admin/users/${userId}`);
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const toogleBan = async (userId) => {
  try {
    if (!token) {
      nextLogin();
    }
    const response = await api.put(`user/admin/users/${userId}/ban`);
    return response;
  } catch (error) {
    nextError(error);
    return res(error);
  }
};
export const getAdminList = async () => {
  try {
    const response = await api.get(`/user/list/admin`);
    return response.data.users;
  } catch (error) {
    // nextError(error);
    return null;
  }
};
export const updateUser = async (userId, userData) => {
  try {
    if (!token) {
      nextLogin(); // You should ensure this handles redirecting or logging out the user.
    }

    const formData = new FormData();

    // Add fields to formData except avatar and coverPhoto
    Object.keys(userData).forEach((key) => {
      if (key !== "avatar" && key !== "coverPhoto") {
        formData.append(key, userData[key]);
      }
    });

    // Append avatar and cover photo if they exist
    if (userData.avatar) {
      formData.append("avatar", userData.avatar);
    }
    if (userData.coverPhoto) {
      formData.append("coverPhoto", userData.coverPhoto);
    }

    const response = await api.put(
      `/user/admin/profile/update/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    nextError(error); // Handle errors appropriately
    return error.response;
  }
};
