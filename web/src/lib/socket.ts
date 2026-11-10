import { io, Socket } from 'socket.io-client';

// Conexión directa al backend (cors abierto en dev).
// En producción: mismo origen o env var VITE_WS_URL.
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(`${WS_URL}/des`, {
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
