import { io } from "socket.io-client";

let socket = null;

const SOCKET_SERVER = "https://zentra-o7c5.onrender.com";

console.log("🔌 Socket server:", SOCKET_SERVER);

export const initSocket = (userId) => {
  if (socket && socket.connected) {
    console.log("📡 Socket already connected");
    return socket;
  }

  console.log("📡 Initializing socket connection with userId:", userId);
  
  socket = io(SOCKET_SERVER, {
    auth: { userId },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("⚠️ Socket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("🔌 Socket disconnected");
  }
};

export const getSocket = () => socket;
