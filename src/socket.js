import { io } from "socket.io-client";

// export const createSocket = (token) => {
//   return io(import.meta.env.VITE_BACKEND_URL, {
//     transports: ["websocket", "polling"],
//     auth: { token },
//   });
// };
export const createSocket = (token) => {
  return io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["polling", "websocket"],  // polling primero para el handshake
    auth: { token },
  });
};