import api from "./api";
import authToken from "./storage/authToken";
/**
 * Lấy thông tin hồ sơ người dùng.
 * @returns {Promise<Object>} Dữ liệu người dùng từ API.
 */
export const getProfile = async () => {
  try {
    if (!authToken.getToken()) {
      return null;
    }
    const response = await api.get("user/profile");
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getCurrentUser = async (id) => {
  try {
    const response = await api.get("user/profile/" + id);
    // console.log(response)
    return response.data;
  } catch (error) {
    return null;
  }
};
export const getSearchUser = async (name) => {
  try {
    const response = await api.get("user/finduser/" + name); 
    return response.data;
  } catch (error) {
    return null;
  }
};
