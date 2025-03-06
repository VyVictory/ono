import api from "./api";
import authToken from "./storage/authToken";
/**
 * Đăng ký tài khoản.
 * @param {Object} userData - Dữ liệu đăng ký.
 * @param {string} userData.name - Tên đầy đủ.
 * @param {string} userData.email - Email.
 * @param {string} userData.password - Mật khẩu.
 * @param {Date} userData.birthDate - Ngày sinh.
 * @param {string} userData.gender - Giới tính.
 * @returns {Promise<Object>} Dữ liệu phản hồi từ API.
 */
export const register = async (userData) => {
  try {
    const response = await api.post("auth/register", {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      birthDate: userData.birthDate,
      gender: userData.gender,
    });
    const { token } = response.data;
    authToken.setToken(token);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Register Error: ", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Đăng nhập tài khoản.
 * @param {Object} credentials - Thông tin đăng nhập.
 * @param {string} credentials.email - Email.
 * @param {string} credentials.password - Mật khẩu.
 * @returns {Promise<Object>} Dữ liệu phản hồi từ API (bao gồm token).
 */
export const login = async (credentials) => {
  try {
    const response = await api.post("auth/login", credentials);
    const { token, user } = response.data;

    // Lưu token vào localStorage
    // saveToken(token);
    authToken.setToken(token);

    return { token, user };
  } catch (error) {
    console.error("Login Error: ", error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Đăng xuất tài khoản (xóa token).
 */
export const logout = () => {
  localStorage.removeItem("authToken");
};

export default api;
