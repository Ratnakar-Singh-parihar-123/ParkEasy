import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    // optional: join room (future use)
    socket.on("join", (userId) => {
      socket.join(userId);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

// 🔥 THIS IS IMPORTANT (REAL-TIME BROADCAST FUNCTION)
export const sendNotificationToAll = (data) => {
  if (!io) return;

  io.emit("newNotification", data);
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }

  return io;
};
