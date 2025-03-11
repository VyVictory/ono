import authToken from "../storage/authToken";

export const nextError = (error) => {
  if (error.response?.status === 401) {
    authToken.deleteToken();
    window.location.href = "/login"; // Chuyển hướng
  }
};

export const nextLogin = () => {
  authToken.deleteToken();
  window.location.href = "/login"; // Chuyển hướng
};
