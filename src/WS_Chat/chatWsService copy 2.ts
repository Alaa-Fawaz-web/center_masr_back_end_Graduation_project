// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Server, WebSocket } from 'ws';
// import { PrismaService } from 'src/prisma.service';
// import { SocketEvent } from './chat.types';

// @Injectable()
// export class ChatWsService implements OnModuleInit, OnModuleDestroy {
//   private wss: Server;
//   private httpServer: any;

//   private users = new Map<string, Set<WebSocket>>();
//   private rooms = new Map<string, Set<string>>();
//   private joinedUsers = new Set<string>();

//   // constructor(private prisma: PrismaService) {}

//   // =============================
//   // 🔌 inject HTTP server
//   // =============================
//   setServer(server: any) {
//     this.httpServer = server;
//   }

//   private isUserInRoom(userId: string, roomId: string): boolean {
//     const room = this.rooms.get(roomId);

//     if (!room) return false;

//     return room.has(userId);
//   }

//   // =============================
//   // 🚀 INIT WS SERVER
//   // =============================
//   onModuleInit() {
//     this.wss = new Server({ server: this.httpServer });

//     console.log('🚀 WS running on same HTTP server');

//     this.wss.on('connection', (socket: WebSocket, req: any) => {
//       const url = new URL(req.url, 'http://localhost');
//       const userId = url.searchParams.get('userId')?.trim();

//       if (!userId) {
//         socket.close();
//         return;
//       }

//       console.log('🔥 USER CONNECTED:', userId);

//       this.subscribe(userId, socket);

//       // =============================
//       // 📩 MESSAGE HANDLER (SAFE)
//       // =============================
//       socket.on('message', (data: any) => {
//         let msg: SocketEvent;

//         try {
//           const raw = data.toString();
//           console.log('📩 RAW:', raw);

//           msg = JSON.parse(raw);
//         } catch (err) {
//           console.log('❌ INVALID JSON:', data.toString());

//           socket.send(
//             JSON.stringify({
//               type: 'error',
//               payload: { message: 'Invalid JSON format' },
//             }),
//           );

//           return; // 🔥 stop execution
//         }

//         this.handleEvent(userId, msg);
//       });

//       // =============================
//       // ⚠️ ERROR HANDLER
//       // =============================
//       socket.on('error', (err) => {
//         console.log('⚠️ SOCKET ERROR:', err.message);
//         socket.terminate();
//       });

//       // =============================
//       // ❌ DISCONNECT
//       // =============================
//       socket.on('close', () => {
//         this.unsubscribe(userId, socket);
//         console.log('❌ USER DISCONNECTED:', userId);
//       });
//     });
//   }

//   // =============================
//   // 🛑 CLEANUP
//   // =============================
//   onModuleDestroy() {
//     this.wss?.close();
//   }

//   // =============================
//   // 👤 SUBSCRIBE USER
//   // =============================
//   subscribe(userId: string, socket: WebSocket) {
//     if (!this.users.has(userId)) {
//       this.users.set(userId, new Set());
//     }

//     this.users.get(userId)!.add(socket);
//   }

//   // =============================
//   // 👤 UNSUBSCRIBE USER
//   // =============================
//   unsubscribe(userId: string, socket: WebSocket) {
//     const sockets = this.users.get(userId);

//     if (!sockets) return;

//     sockets.delete(socket);

//     if (sockets.size === 0) {
//       this.users.delete(userId);
//     }
//   }

//   // =============================
//   // 🎯 EVENT HANDLER
//   // =============================
//   async handleEvent(userId: string, msg: SocketEvent) {
//     try {
//       switch (msg.type) {
//         case 'join':
//           this.joinRoom(userId, msg.payload);
//           break;

//         case 'send_message':
//           this.handleMessage(userId, msg.payload);
//           break;

//         case 'typing':
//           this.typing(userId, msg.payload);
//           break;

//         case 'seen':
//           this.seen(userId, msg.payload);
//           break;
//       }
//     } catch (err) {
//       console.log('🔥 HANDLE ERROR:', err);
//     }
//   }

//   // =============================
//   // 🏠 JOIN ROOM
//   // =============================

//   joinRoom(userId: string, conversationId: string) {
//     if (!this.rooms.has(conversationId)) {
//       this.rooms.set(conversationId, new Set());
//     }

//     this.rooms.get(conversationId)!.add(userId);

//     console.log(`👥 ${userId} joined ${conversationId}`);

//     this.sendToUser(userId, {
//       type: 'joined',
//       payload: { conversationId },
//     });
//   }
//   // joinRoom(userId: string, conversationId: string) {
//   //   if (!this.rooms.has(conversationId)) {
//   //     this.rooms.set(conversationId, new Set());
//   //   }

//   //   this.rooms.get(conversationId)!.add(userId);

//   //   console.log('👥 JOIN:', userId, '->', conversationId);
//   // }

//   // =============================
//   // 💬 MESSAGE
//   // =============================

//   handleMessage(userId: string, payload: any) {
//     const { conversationId, content } = payload;

//     // 🔥 CHECK JOIN FIRST
//     if (!this.isUserInRoom(userId, conversationId)) {
//       console.log('⛔ USER NOT IN ROOM:', userId);

//       this.sendToUser(userId, {
//         type: 'error',
//         payload: {
//           message: 'You must join room first',
//         },
//       });

//       return;
//     }

//     const message = {
//       id: Date.now(),
//       content,
//       senderId: userId,
//       conversationId,
//     };

//     const roomUsers = this.rooms.get(conversationId);

//     roomUsers?.forEach((uid) => {
//       this.sendToUser(uid, {
//         type: 'new_message',
//         payload: message,
//       });
//     });
//   }

//   // =============================
//   // ✍️ TYPING
//   // =============================
//   typing(userId: string, conversationId: string) {
//     const users = this.rooms.get(conversationId);

//     users?.forEach((uid) => {
//       if (uid !== userId) {
//         this.sendToUser(uid, {
//           type: 'typing',
//           payload: { userId },
//         });
//       }
//     });
//   }

//   // =============================
//   // ✔✔ SEEN
//   // =============================
//   seen(userId: string, payload: any) {
//     const { conversationId, messageId } = payload;

//     const users = this.rooms.get(conversationId);

//     users?.forEach((uid) => {
//       if (uid !== userId) {
//         this.sendToUser(uid, {
//           type: 'seen',
//           payload: { messageId, userId },
//         });
//       }
//     });
//   }

//   // =============================
//   // 📤 SEND TO USER
//   // =============================
//   sendToUser(userId: string, data: any) {
//     const sockets = this.users.get(userId);

//     if (!sockets) return;

//     sockets.forEach((socket) => {
//       if (socket.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify(data));
//       }
//     });
//   }
// }
