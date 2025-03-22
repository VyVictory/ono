import { io } from "socket.io-client";
import connectENV from "../connectENV"; 

// Khởi tạo socket
const socketConfig = io(connectENV.socketUrl || "ws://localhost:3001/", {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socketConfig;
