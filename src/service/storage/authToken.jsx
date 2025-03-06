import cookieModule from "./cookie.module";

function getToken() {
    return cookieModule().getCookie("TokenDoan4");
}
function setToken(value) {
    if (getToken()) {
        deleteToken();
        return cookieModule().setCookie("TokenDoan4", value, 24)
    } else {
        return cookieModule().setCookie("TokenDoan4", value, 24)
    }
}
function deleteToken() {
    return cookieModule().deleteCookie("TokenDoan4")
}
export default { getToken, setToken, deleteToken };