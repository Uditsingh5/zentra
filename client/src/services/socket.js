import { io } from "socket.io-client";

let socket = null;

const getSocketUrl = () =>
  import.meta.env.VITE_SOCKET_URL || window.location.origin;

export const initSocket = (userId) => {
  if (socket && socket.connected) {
    return socket;
  }

  socket = io(getSocketUrl(), {
    auth: { userId },
    transports: ["websocket", "polling"],
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

