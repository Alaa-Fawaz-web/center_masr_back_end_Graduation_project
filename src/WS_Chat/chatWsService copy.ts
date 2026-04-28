// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Server, WebSocket } from 'ws';
// import { PrismaService } from 'src/prisma.service';
// import { Request } from 'express';
// import { PayloadType, SocketEvent } from './chat.types';

// @Injectable()
// export class ChatWsService implements OnModuleInit, OnModuleDestroy {
//   private wss: Server;

//   private users = new Map<string, WebSocket>();
//   private rooms = new Map<string, Set<string>>();

//   constructor(private prisma: PrismaService) {}

//   // =============================
//   // 🎯 set user in online
//   // =============================
//   subscribe(matchId: string, socket: WebSocket) {
//     // if (!this.users.has(matchId)) {
//     this.users.set(matchId, new Set());
//     this.users.get(matchId).add(socket);
//     // this.users.set(matchId, new Set(socket));
//     // }

//     return;
//     console.log('socket.readyState: ', socket.readyState);

//     this.users.get(matchId).add(socket);
//     console.log('socket.readyState: 1111', this.users.get(matchId).readyState);
//   }

//   // =============================
//   // 🎯 delete user in offline
//   // =============================
//   unsubscribe(matchId: string, socket: WebSocket) {
//     const subscribers = this.users.get(matchId);

//     if (!subscribers) return;

//     subscribers.delete(socket);

//     if (subscribers.size === 0) {
//       this.users.delete(matchId);
//     }
//   }

//   // =============================
//   // 🚀 INIT SERVER
//   // =============================
//   onModuleInit() {
//     this.wss = new Server({ port: 3001 });

//     console.log('🚀 WS running on ws://localhost:3001');

//     this.wss.on('connection', (socket: WebSocket, req: Request) => {
//       const url = new URL(req.url!, 'http://localhost');

//       const userId = url.searchParams.get('userId');
//       const room = new Set([]);

//       console.log('🔥 CLIENT CONNECTED', userId);

//       if (!userId) {
//         console.log('❌ DISCONNECTED user: ', userId);
//         socket.close();
//         return;
//       }

//       // this.users.set(userId, socket);
//       this.subscribe(userId, socket);

//       console.log('👤 USER CONNECTED:', userId);

//       // console.log('👤 USERS CONNECTED:', this.users);
//       console.log('👤 ROOMS CONNECTED:', this.rooms);
//       socket.on('message', (data: SocketEvent) => {
//         try {
//           const msg: SocketEvent = JSON.parse(data.toString());

//           console.log('📩 RECEIVED:', msg);

//           this.handleEvent(userId, msg);
//         } catch (err) {
//           console.log('❌ Invalid JSON:', JSON.parse(data.toString()));
//         }
//       });

//       socket.on('close', () => {
//         console.log('❌ DISCONNECTED:', userId);
//         this.users.delete(userId);
//       });
//     });
//   }

//   onModuleDestroy() {
//     // this.unsubscribe("", this.wss);
//     console.log('❌ DISCONNECTED:', this.wss);
//     this.wss?.close();
//   }

//   // =============================
//   // 🎯 send Json Data
//   // =============================
//   sendJson(socket: WebSocket, payload: PayloadType) {
//     if (socket.readyState !== WebSocket.OPEN) return;

//     socket.send(JSON.stringify(payload));
//   }

//   // =============================
//   // 🎯 clean up users in online
//   // =============================
//   cleanupSubscriptions(socket: WebSocket) {
//     for (const matchId of socket.subscriptions) {
//       this.unsubscribe(matchId, socket);
//     }
//   }

//   // =============================
//   // 🎯 HANDLER
//   // =============================
//   async handleEvent(userId: string, msg: SocketEvent) {
//     console.log('🎯 EVENT:', msg);

//     switch (msg.type) {
//       case 'join':
//         this.joinRoom(userId, msg.payload);
//         break;

//       case 'send_message': {
//         const roomId = msg.payload.conversationId;

//         const message = {
//           content: msg.payload.content,
//           senderId: userId,
//           conversationId: roomId,
//         };

//         console.log(this.rooms);
//         console.log(this.rooms.has(roomId));

//         // 🔥 fallback لو مفيش room
//         if (!this.rooms.has(roomId)) {
//           console.log('⚠️ Room not found, auto creating:', roomId);
//           this.joinRoom(userId, roomId);
//         }

//         this.broadcast(roomId, {
//           type: 'send_message',
//           payload: message,
//         });

//         break;
//       }

//       case 'typing':
//         this.typing(userId, msg.payload);
//         break;

//       case 'seen':
//         // await this.prisma.message.update({
//         //   where: { id: msg.payload.messageId },
//         //   data: { seenAt: new Date() },
//         // });
//         break;
//     }
//   }

//   // =============================
//   // 🏠 JOIN ROOM
//   // =============================
//   joinRoom(userId: string, conversationId: string) {
//     if (!this.rooms.has(conversationId)) {
//       this.rooms.set(conversationId, new Set());
//     }

//     console.log('👥 JOIN ROOM:', userId, '->', conversationId);

//     this.rooms.get(conversationId)!.add(userId);

//     console.log('👥 JOIN:', userId, '->', conversationId);
//     console.log('📦 ROOM STATE:', this.rooms);
//   }

//   // =============================
//   // 📢 BROADCAST
//   // =============================
//   broadcast(conversationId: string, data: SocketEvent) {
//     const users = this.rooms.get(conversationId);

//     console.log('📢 BROADCAST ROOM:', this.rooms);
//     console.log('👥 USERS: ', users);

//     if (!users || users.size === 0) {
//       console.log('⚠️ No users in room');
//       return;
//     }

//     users.forEach((userId) => {
//       console.log('userId', userId);
//       // if (!socket || socket === undefined) {
//       //     console.log('❌ socket not found:', userId);
//       //     return;
//       //   }
//       this.sendToUser(userId, data);
//     });
//   }

//   // =============================
//   // 📤 SEND
//   // =============================
//   sendToUser(userId: string, data: any) {
//     const socket = this.users.get(userId);

//     if (!socket || socket === undefined) {
//       console.log('❌ socket not found:', userId);
//       return;
//     }

//     console.log('socket: ', socket.readyState);
//     // console.log('📤 SEND TO USER:', userId, data);
//     // console.log(socket.readyState !== WebSocket.OPEN);
//     console.log(socket.readyState);
//     console.log(WebSocket.OPEN);
//     if (socket.readyState !== WebSocket.OPEN) {
//       console.log('❌ socket not open:', userId);
//       return;
//     }

//     socket.send(JSON.stringify(data));
//   }

//   // =============================
//   // ✍️ TYPING
//   // =============================
//   typing(userId: string, conversationId: string) {
//     const users = this.rooms.get(conversationId);

//     users?.forEach((uId) => {
//       if (uId !== userId) {
//         this.sendToUser(uId, {
//           type: 'typing',
//           payload: { userId },
//         });
//       }
//     });
//   }
// }
