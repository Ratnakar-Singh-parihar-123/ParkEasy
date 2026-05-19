import { useEffect, useState } from "react";
import socket from "../socket/socket";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // socket connect
    socket.on("connect", () => {
      console.log("Socket Connected:", socket.id);
    });

    // REAL TIME LISTENER
    socket.on("newNotification", (data) => {
      console.log("NEW NOTIFICATION:", data);

      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("newNotification");
    };
  }, []);

  return { notifications, setNotifications };
};
