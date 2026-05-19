import { io } from "socket.io-client";

const socket = io("https://parkeasy-5qpq.onrender.com", {
  transports: ["websocket"],
});

export default socket;
