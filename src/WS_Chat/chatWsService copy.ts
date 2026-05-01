// // User presence
// Map<userId, Set<WebSocket>>
// Conversations index (important)
// Map<userId, Set<userId>> // مين متوصل مع مين
// 🚀 WS SERVICE (FULL SYSTEM)
// 🔥 1. Core setup
// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Server, WebSocket } from 'ws';

// @Injectable()
// export class ChatWsService implements OnModuleInit, OnModuleDestroy {
//   private wss: Server;
//   private httpServer: any;

//   // 👤 online users
//   private users = new Map<string, Set<WebSocket>>();

//   // 💬 conversations index
//   private conversations = new Map<string, Set<string>>();

//   setServer(server: any) {
//     this.httpServer = server;
//   }
// 🟢 2. Connection
// onModuleInit() {
//   this.wss = new Server({ server: this.httpServer });

//   console.log("🚀 WS ready");

//   this.wss.on("connection", (socket: WebSocket, req: any) => {
//     const url = new URL(req.url, "http://localhost");
//     const userId = url.searchParams.get("userId")?.trim();

//     if (!userId) return socket.close();

//     this.addUser(userId, socket);

//     // 🔥 notify online
//     this.broadcastPresence(userId, true);

//     socket.on("message", (data) => this.handleMessage(userId, data, socket));

//     socket.on("close", () => {
//       this.removeUser(userId, socket);
//       this.broadcastPresence(userId, false);
//     });
//   });
// }
// 👤 3. Online / Offline system
// addUser(userId: string, socket: WebSocket) {
//   if (!this.users.has(userId)) {
//     this.users.set(userId, new Set());
//   }

//   this.users.get(userId)!.add(socket);
// }

// removeUser(userId: string, socket: WebSocket) {
//   const sockets = this.users.get(userId);
//   if (!sockets) return;

//   sockets.delete(socket);

//   if (sockets.size === 0) {
//     this.users.delete(userId);
//   }
// }
// 🟢 Broadcast presence فقط للناس المرتبطين
// broadcastPresence(userId: string, isOnline: boolean) {
//   const related = this.conversations.get(userId);
//   if (!related) return;

//   related.forEach((otherUser) => {
//     this.sendToUser(otherUser, {
//       type: "presence",
//       payload: {
//         userId,
//         isOnline,
//       },
//     });
//   });
// }
// 💬 4. Chat system (User ↔ User only)
// join conversation
// joinConversation(userId: string, otherUserId: string) {
//   const key = this.getConvKey(userId, otherUserId);

//   if (!this.conversations.has(key)) {
//     this.conversations.set(key, new Set());
//   }

//   this.conversations.get(key)!.add(userId);
//   this.conversations.get(key)!.add(otherUserId);
// }
// key generator
// getConvKey(a: string, b: string) {
//   return [a, b].sort().join("_");
// }
// send message
// handleChat(userId: string, payload: any) {
//   const { toUserId, content } = payload;

//   const convKey = this.getConvKey(userId, toUserId);

//   // 🚨 must be in conversation
//   if (!this.conversations.get(convKey)?.has(userId)) {
//     this.sendToUser(userId, {
//       type: "error",
//       payload: { message: "Not in conversation" },
//     });
//     return;
//   }

//   const message = {
//     id: Date.now(),
//     senderId: userId,
//     content,
//     conversationId: convKey,
//   };

//   // send to both users
//   [userId, toUserId].forEach((uid) => {
//     this.sendToUser(uid, {
//       type: "new_message",
//       payload: message,
//     });
//   });
// }
// 🔔 5. Notifications system (Teacher events)
// example: lesson / post
// notifyAllStudents(payload: any) {
//   const students = this.getAllStudents(); // from DB

//   students.forEach((studentId) => {
//     this.sendToUser(studentId, {
//       type: "notification",
//       payload,
//     });
//   });
// }
// teacher events
// handleBusinessEvents(event: any) {
//   switch (event.type) {
//     case "create_lesson":
//       this.notifyAllStudents({
//         title: "New Lesson",
//         message: event.payload.title,
//       });
//       break;

//     case "create_post":
//       this.notifyAllStudents({
//         title: "New Post",
//         message: event.payload.title,
//       });
//       break;
//   }
// }
// 📩 6. message router
// handleMessage(userId: string, data: any, socket: WebSocket) {
//   let msg;

//   try {
//     msg = JSON.parse(data.toString());
//   } catch {
//     return;
//   }

//   switch (msg.type) {
//     case "join":
//       this.joinConversation(userId, msg.payload.otherUserId);
//       break;

//     case "send_message":
//       this.handleChat(userId, msg.payload);
//       break;

//     case "business_event":
//       this.handleBusinessEvents(msg);
//       break;
//   }
// }
// 📤 7. send helper
// sendToUser(userId: string, data: any) {
//   const sockets = this.users.get(userId);
//   if (!sockets) return;

//   sockets.forEach((socket) => {
//     if (socket.readyState === WebSocket.OPEN) {
//       socket.send(JSON.stringify(data));
//     }
//   });
// }
