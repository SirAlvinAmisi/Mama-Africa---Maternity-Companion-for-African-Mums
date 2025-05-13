import { io } from "socket.io-client";

const socket = io(
  import.meta.env.PROD
    ? "https://mama-africa.onrender.com"
    : "http://localhost:5000",
  {
    transports: ["websocket", "polling"],
    withCredentials: true,
    autoConnect: false, // So you control when to join
  }
);

export default socket;
