import { io } from "socket.io-client";
import connectENV from "../connectENV";

const socketConfig = io(connectENV.socketUrl || "wss://localhost:3001/", {
  withCredentials: true,
  transports: ["websocket", "polling"], // Chỉ định các phương thức kết nối
});

export default socketConfig;
