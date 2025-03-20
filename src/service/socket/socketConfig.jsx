import { io } from "socket.io-client";
import connectENV from "../connectENV";

const SOCKET_URL = connectENV.socketUrl;

// Khởi tạo socket
const socketConfig = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socketConfig;
