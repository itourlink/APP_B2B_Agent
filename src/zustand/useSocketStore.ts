// import { create } from "zustand";
// import { io, Socket } from "socket.io-client";
// import { ACCESS_TOKEN } from "@/utils/constants";
// import { CONFIG } from "@/config-global";

// interface SocketState {
//   socket: Socket | null;
//   userId: string | null;
//   connectSocket: (userId: string) => void;
//   disconnectSocket: () => void;
// }
// export const useSocketStore = create<SocketState>((set, get) => ({
//   socket: null,
//   userId: null,

//   connectSocket: (userId: string) => {
//     const existingSocket = get().socket;
//     const existingUserId = get().userId;

//     if (existingSocket && existingUserId === userId) {
//       return;
//     }

//     if (existingSocket) {
//       existingSocket.disconnect();
//     }

//     const token = localStorage.getItem(ACCESS_TOKEN) || "";

//     const socket = io(CONFIG.socketServerUrl, {
//       query: { userId },
//       extraHeaders: { token },
//       reconnectionAttempts: Infinity,
//     });

//     socket.on("connect", () => {
//       console.log("✅ Socket connected");
//     });

//     socket.on("connect_error", (err) => {
//       console.error("❌ Connection error:", err.message);
//     });

//     set({ socket, userId });
//   },

//   disconnectSocket: () => {
//     const socket = get().socket;
//     if (socket) {
//       socket.disconnect();
//       console.log("🔌 Socket disconnected");
//     }
//     set({ socket: null, userId: null });
//   },
// }));
