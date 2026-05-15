import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import http from "http";
import logger from "../src/lib/logger.js";

const prisma = new PrismaClient();

// logger.info("Hello log file test");
// logger.error("Test error log");

// Create HTTP server
const httpServer = http.createServer();

// Create Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: [
      // "http://localhost:3000",
      // "http://192.168.0.239:3000"
      "*"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(" User connected:", socket.id);

  socket.on("user-auth", async (userId) => {
    socket.userId = userId;
    onlineUsers.set(socket.id, userId);
    console.log(` User ${userId} authenticated`);
    
    const onlineUserIds = Array.from(onlineUsers.values());
    io.emit("users-online", onlineUserIds);
  });

  socket.on("get-chat-history", async (otherUserId) => {
    if (!socket.userId) return;
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: socket.userId, toUserId: otherUserId },
          { fromUserId: otherUserId, toUserId: socket.userId }
        ]
      },
      orderBy: { createdAt: "asc" }
    });
    
    socket.emit("chat-history", messages);
  });

  socket.on("send-message", async (data) => {
    if (!socket.userId) return;
    
    console.log(` Message from ${socket.userId} to ${data.toUserId}: ${data.content}`);
    
    const message = await prisma.message.create({
      data: {
        content: data.content,
        fromUserId: socket.userId,
        toUserId: parseInt(data.toUserId)
      }
    });
    
    const messageToSend = {
      id: message.id,
      content: message.content,
      fromUserId: message.fromUserId,
      toUserId: message.toUserId,
      createdAt: message.createdAt
    };
    
    // Send back to sender
    socket.emit("message-sent", messageToSend);
    
    // Send to receiver if online
    for (let [sId, uId] of onlineUsers.entries()) {
      if (uId === parseInt(data.toUserId)) {
        io.to(sId).emit("new-message", messageToSend);
        console.log(` Sent to receiver ${data.toUserId}`);
        break;
      }
    }
  });

  // ========== GROUP CHAT EVENTS ==========
  
  socket.on("join-group", (groupId) => {
    socket.join(`group:${groupId}`);
    console.log(` User ${socket.userId} joined group: ${groupId}`);
  });

  socket.on("leave-group", (groupId) => {
    socket.leave(`group:${groupId}`);
    console.log(` User ${socket.userId} left group: ${groupId}`);
  });

  socket.on("send-group-message", async (data) => {
    if (!socket.userId) return;
    
    const { groupId, content } = data;
    console.log(` Group message from ${socket.userId} to group: ${groupId}`);
    
    const message = await prisma.groupMessage.create({
      data: {
        content,
        groupId,
        userId: socket.userId
      },
      include: {
        user: { select: { id: true, name: true } }
      }
    });
    
    io.to(`group:${groupId}`).emit("new-group-message", message);
    console.log(` Broadcast to group: ${groupId}`);
  });

  socket.on("disconnect", () => {
    const userId = socket.userId;
    onlineUsers.delete(socket.id);
    console.log(` User ${userId} disconnected`);
    
    const onlineUserIds = Array.from(onlineUsers.values());
    io.emit("users-online", onlineUserIds);
  });
});

// Start server on port 3001
const PORT = 3001;
const HOST = '0.0.0.0';

httpServer.listen(PORT, HOST, () => {
  console.log(` Socket server running on:`);
  console.log(`   - http://localhost:${PORT}`);
  console.log(`   - http://192.168.0.239:${PORT}`);
});