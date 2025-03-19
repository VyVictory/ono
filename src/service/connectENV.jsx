// let uri = "https://doan4-5by5.onrender.com/";
// let uri = "http://localhost:3001/";

const uri = process.env.REACT_APP_DATABASE_URL || "http://localhost:3001/";
const apiAuth = `${uri}auth`;
const api = `${uri}`;
const apiUser = `${uri}user`;
const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:3001/";
export default {
  apiAuth,
  api,
  apiUser,
  socketUrl,
};
