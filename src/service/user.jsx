import api from "./components/api";
import authToken from "./storage/authToken";
import { nextLogin, nextError } from "./components/nextLogin";
/**
 * Lấy thông tin hồ sơ người dùng.
 * @returns {Promise<Object>} Dữ liệu người dùng từ API.
 */
export const getProfile = async () => {
  try {
    if (!authToken.getToken()) {
      // nextLogin();
      return null;
    }
    const response = await api.get("user/profile");
    return response.data;
  } catch (error) {
    nextError(error);
    return null;
  }
};
export const getCurrentUser = async (id) => {
  try {
    const response = await api.get("user/profile/" + id);
    // console.log(response)
    return response.data;
  } catch (error) {
    // nextError(error);
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
// firstName,
// lastName,
// gender,
// title,
// birthDate,

// street,
// ward,
// district,
// city,
// country,

// education,

// email,
// phoneNumber,
export const editUser = async (userData) => { 
  try {
    const response = await api.put("user/profile/update", userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật:", error);
    return null;
  }
};
export const editUserImage = async (formData) => {
  try {
    const response = await api.put("/user/profile/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true, // Nếu API cần xác thực cookie
    });

    return response; // Trả về dữ liệu user mới
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật ảnh:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Có lỗi xảy ra khi cập nhật ảnh!"
    );
  }
};
