// let uri = "https://doan4-5by5.onrender.com/";
// let uri = "http://localhost:3001/";
const uri = process.env.REACT_APP_API_URL || "http://localhost:3001/";
const apiAuth = `${uri}auth`;
const api = `${uri}`;
const apiUser = `${uri}user`;
export default {
  apiAuth,
  api,
  apiUser,
};
