import cookieModule from "./cookie.module";

export const getSetting = ({ name, userId }) => {
  if (!name) return null;
  return cookieModule().getCookie(`${name}_${userId}`);
};
export const setSetting = ({ name, value, userId }) => {
  if (!name || value === undefined) return null;
  return cookieModule().setCookie(`${name}_${userId}`, value, Infinity);
};

export const deleteSetting = ({ name, userId }) => {
  if (!name) return null;
  return cookieModule().deleteCookie(`${name}_${userId}`);
};
