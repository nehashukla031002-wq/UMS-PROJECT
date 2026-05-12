'use client';

import { io } from "socket.io-client";

let socket = null;

export const getSocket = (token) => {
  if (typeof window === 'undefined') {
    return null;
  }


  if (!socket) {
    socket = io("http://192.168.0.239:3001", {
      transports: ["websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  
  // if (!socket) {
  //   socket = io("http://localhost:3001", {
  //     transports: ["websocket"],
  //     autoConnect: false,
  //     reconnection: true,
  //     reconnectionAttempts: 5,
  //     reconnectionDelay: 1000,
  //   });
    
    socket.on('connect', () => {
      console.log(' Socket connected with id:', socket?.id);
    });
    
    socket.on('disconnect', (reason) => {
      console.log(' Socket disconnected:', reason);
    });
    
    socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error.message);
    });
  }
  
  // If token provided and socket not connected, connect with auth
  if (token && !socket.connected) {
    socket.auth = { token };
    socket.connect();
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const isSocketConnected = () => {
  return socket?.connected || false;
};