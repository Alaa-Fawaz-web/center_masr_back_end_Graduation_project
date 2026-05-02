// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import { Server, WebSocket } from 'ws';
// import { MessageService } from './Message.service';

// @Injectable()
// export class ChatWsService implements OnModuleInit, OnModuleDestroy {
//   private wss: Server;
//   private httpServer: any;

//   constructor(private messageService: MessageService) {}
//   private users = new Map<string, Set<WebSocket>>();
//   private conversations = new Map<string, Set<string>>();
//   private userContacts = new Map<string, Set<string>>();

//   setServer(server: any) {
//     this.httpServer = server;
//   }

//   onModuleInit() {
//     this.wss = new Server({ server: this.httpServer });

//     console.log('🚀 WS running');

//     this.wss.on('connection', async (socket: WebSocket, req: any) => {
//       const url = new URL(req.url, 'http://localhost');
//       const userId = url.searchParams.get('userId');

//       if (!userId) return socket.close();

//       console.log('🔥 CONNECT:', userId);
//       console.log(this.conversations);
//       this.addUser(userId, socket);
//       this.handleConnection(userId);

//       socket.on('message', (data) => {
//         console.log('message', data);
//         this.handleMessage(userId, data);
//       });

//       socket.on('close', () => {
//         console.log('❌ DISCONNECT:', userId);
//         this.removeUser(userId, socket);
//         this.handleDisconnect(userId);
//       });
//     });
//   }

//   onModuleDestroy() {
//     console.log('onModuleDestroy');
//     this.wss?.close();
//   }

//   // ================= USERS =================
//   addUser(userId: string, socket: WebSocket) {
//     console.log('addUser', userId);
//     if (!this.users.has(userId)) {
//       this.users.set(userId, new Set());
//     }
//     this.users.get(userId)!.add(socket);
//   }

//   removeUser(userId: string, socket: WebSocket) {
//     console.log('removeUser', userId);
//     const sockets = this.users.get(userId);
//     if (!sockets) return;

//     sockets.delete(socket);
//     if (sockets.size === 0) {
//       this.users.delete(userId);
//     }
//   }

//   // ================= CONTACTS =================
//   setUserContacts(userId: string, contacts: string[]) {
//     console.log('setUserContacts', userId, contacts);
//     this.userContacts.set(userId, new Set(contacts));

//     this.sendToUser(userId, {
//       type: 'contacts',
//       payload: contacts.map((id) => ({
//         id,
//         name: `User ${id}`,
//         studyMaterial: '---',
//         lastMessage: '',
//       })),
//     });
//   }
//   initConversations(userId: string, conversations: any[]) {
//     console.log('initConversations', userId);

//     if (!Array.isArray(conversations)) return;

//     conversations.forEach(({ receiverId }) => {
//       if (!receiverId) return;

//       // 1. سجل عندي إن الـ receiverId هو جهة اتصال لي (عشان أشوف حالته)
//       if (!this.userContacts.has(userId)) {
//         this.userContacts.set(userId, new Set());
//       }
//       this.userContacts.get(userId)!.add(receiverId);

//       // 2. 🔥 الأهم: سجل عند الـ receiverId إنني (userId) أراقبه
//       // لكي يتم إخطاري عندما يدخل أو يخرج
//       if (!this.userContacts.has(receiverId)) {
//         this.userContacts.set(receiverId, new Set());
//       }
//       this.userContacts.get(receiverId)!.add(userId);

//       // 3. أرسل الحالة الحالية فوراً للمستخدم الحالي
//       if (this.users.has(receiverId)) {
//         this.sendToUser(userId, {
//           type: 'presence',
//           payload: {
//             receiverId,
//             isOnline: true,
//           },
//         });
//       }
//     });

//     // 4. أخبر الجميع أنني دخلت الآن
//     this.broadcastPresence(userId, true);
//   }
//   initConversations(userId: string, conversations: any[]) {
//     console.log('initConversations', userId);

//     if (!Array.isArray(conversations)) return;

//     conversations.forEach(({ receiverId }) => {
//       if (!receiverId) return;

//       if (!this.userContacts.has(userId)) {
//         this.userContacts.set(userId, new Set());
//       }

//       this.userContacts.get(userId)!.add(receiverId);

//       if (this.users.has(receiverId)) {
//         this.sendToUser(userId, {
//           type: 'AllPresence',
//           payload: {
//             senderId: userId,
//             receiverId,
//             isOnline: true,
//           },
//         });
//       }
//     });
//   }
//   // ================= PRESENCE =================
//   broadcastPresence(userId: string, isOnline: boolean) {
//     console.log('broadcastPresence', userId);
//     const contacts = this.userContacts.get(userId);
//     if (!contacts) return;

//     contacts.forEach((contactId) => {
//       if (!this.users.has(contactId)) return;

//       this.sendToUser(contactId, {
//         type: 'presence',
//         payload: { senderId: userId, receiverId: contactId, isOnline },
//       });
//     });
//   }

//   handleConnection(userId: string) {
//     console.log('handleConnection', userId);
//     // بمجرد الاتصال، نرسل للأشخاص المهتمين بنا أننا متصلون
//     this.broadcastPresence(userId, true);
//   }
//   // handleConnection(userId: string) {
//   //   console.log('handleConnection', userId);
//   // }

//   handleDisconnect(userId: string) {
//     console.log('handleDisconnect', userId);
//     this.broadcastPresence(userId, false);
//   }

//   // ================= CONVERSATION =================

//   joinConversation(userId: string, receiverId: string, conversationId: string) {
//     console.log('joinConversation', userId);

//     if (!this.conversations.has(conversationId)) {
//       this.conversations.set(conversationId, new Set());
//     }

//     this.conversations.get(conversationId)!.add(userId);
//     this.conversations.get(conversationId)!.add(receiverId);
//     this.sendToUser(userId, {
//       type: 'new_conversation',
//       payload: {
//         receiverId,
//         conversationId,
//       },
//     });
//   }

//   // isInConversation(userId: string, otherUserId: string) {
//   isInConversation(userId: string, conversationId: string) {
//     console.log('isInConversation', userId, conversationId);
//     return this.conversations.get(conversationId)?.has(userId);
//   }

//   async handleChat(userId: string, payload: any) {
//     const { receiverId, conversationId, content } = payload;
//     console.log('01212121212', payload);

//     if (userId === receiverId) {
//       return this.sendToUser(userId, {
//         type: 'error',
//         payload: { message: 'You cannot send message to yourself' },
//       });
//     }

//     if (!this.isInConversation(userId, conversationId)) {
//       return this.sendToUser(userId, {
//         type: 'error',
//         payload: { message: 'Join conversation first' },
//       });
//     }

//     try {
//       const message = await this.messageService.createMessage(
//         userId,
//         receiverId,
//         conversationId,
//         content,
//       );

//       [userId, receiverId].forEach((uid) => {
//         this.sendToUser(uid, {
//           type: 'new_message',
//           payload: message,
//         });
//       });
//     } catch (err) {
//       this.sendToUser(userId, {
//         type: 'error',
//         payload: { message: 'Failed to send message' },
//       });
//     }
//   }
//   // ================= TYPING =================
//   handleTyping(userId: string, payload: any) {
//     const { receiverId, conversationId, isTyping } = payload;

//     if (!this.isInConversation(userId, conversationId)) return;

//     this.sendToUser(receiverId, {
//       type: 'typing',
//       payload: {
//         receiverId: userId,
//         isTyping,
//       },
//     });
//   }
//   // ================= ROUTER =================
//   handleMessage(userId: string, data: any) {
//     let msg;

//     try {
//       msg = JSON.parse(data.toString());
//     } catch {
//       return;
//     }
//     console.log('init_conversations', msg.payload);

//     switch (msg.type) {
//       case 'init_conversations':
//         console.log('init_conversations', msg.payload);
//         this.initConversations(userId, msg.payload);
//         break;
//       case 'join':
//         console.log('join', msg.payload);
//         this.joinConversation(
//           userId,
//           msg.payload.receiverId,
//           msg.payload.conversationId,
//         );
//         break;

//       case 'open_chat':
//         console.log('sendToUser', userId, data);

//         this.sendToUser(userId, {
//           type: 'presence',
//           payload: {
//             receiverId: msg.payload.receiverId,
//             isOnline: this.users.has(msg.payload.receiverId),
//           },
//         });
//         break;
//       case 'typing': // ✅ جديد
//         this.handleTyping(userId, msg.payload);
//         break;

//       case 'send_message':
//         console.log('send_message', msg.payload);

//         this.handleChat(userId, msg.payload);
//         break;
//     }
//   }

//   broadcastPresence2(userId: string, isOnline: boolean) {
//     const contacts = this.userContacts.get(userId);
//     if (!contacts) return;

//     contacts.forEach((contactId) => {
//       if (!this.users.has(contactId)) return;

//       this.sendToUser(contactId, {
//         type: 'presence',
//         payload: {
//           userId: userId,
//           isOnline,
//         },
//       });
//     });
//   }
//   // ================= SEND =================
//   sendToUser(userId: string, data: any) {
//     console.log('sendToUser', userId, data);
//     const sockets = this.users.get(userId);
//     if (!sockets) return;

//     sockets.forEach((socket) => {
//       if (socket.readyState === WebSocket.OPEN) {
//         socket.send(JSON.stringify(data));
//       }
//     });
//   }
// }

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server, WebSocket } from 'ws';
import { MessageService } from './Message.service';

@Injectable()
export class ChatWsService implements OnModuleInit, OnModuleDestroy {
  private wss: Server;
  private httpServer: any;

  constructor(private messageService: MessageService) {}
  private users = new Map<string, Set<WebSocket>>();
  private conversations = new Map<string, Set<string>>();
  private userContacts = new Map<string, Set<string>>();

  setServer(server: any) {
    this.httpServer = server;
  }

  onModuleInit() {
    this.wss = new Server({ server: this.httpServer });

    console.log('🚀 WS running');

    this.wss.on('connection', async (socket: WebSocket, req: any) => {
      const url = new URL(req.url, 'http://localhost');
      const userId = url.searchParams.get('userId');

      if (!userId) return socket.close();

      console.log('🔥 CONNECT:', userId);
      console.log(this.conversations);
      this.addUser(userId, socket);
      this.handleConnection(userId);

      // ✅ مهم
      this.broadcastPresence(userId, true);

      socket.on('message', (data) => {
        console.log('message', data);
        this.handleMessage(userId, data);
      });

      socket.on('close', () => {
        console.log('❌ DISCONNECT:', userId);
        this.removeUser(userId, socket);
        this.handleDisconnect(userId);
        // ✅ مهم
        this.broadcastPresence(userId, false);
      });
    });
  }

  onModuleDestroy() {
    console.log('onModuleDestroy');
    this.wss?.close();
  }

  // ================= USERS =================
  addUser(userId: string, socket: WebSocket) {
    console.log('addUser', userId);
    if (!this.users.has(userId)) {
      this.users.set(userId, new Set());
    }
    this.users.get(userId)!.add(socket);
  }

  removeUser(userId: string, socket: WebSocket) {
    console.log('removeUser', userId);
    const sockets = this.users.get(userId);
    if (!sockets) return;

    sockets.delete(socket);
    if (sockets.size === 0) {
      this.users.delete(userId);
    }
  }

  // ================= CONTACTS =================
  setUserContacts(userId: string, contacts: string[]) {
    console.log('setUserContacts', userId, contacts);
    this.userContacts.set(userId, new Set(contacts));

    this.sendToUser(userId, {
      type: 'contacts',
      payload: contacts.map((id) => ({
        id,
        name: `User ${id}`,
        studyMaterial: '---',
        lastMessage: '',
      })),
    });
  }

  initConversations(userId: string, conversations: any[]) {
    console.log('initConversations', userId);

    if (!Array.isArray(conversations)) return;

    conversations.forEach(({ receiverId }) => {
      if (!receiverId) return;

      if (!this.userContacts.has(userId)) {
        this.userContacts.set(userId, new Set());
      }

      this.userContacts.get(userId)!.add(receiverId);

      if (this.users.has(receiverId)) {
        this.sendToUser(userId, {
          type: 'AllPresence',
          payload: {
            senderId: userId,
            receiverId,
            isOnline: true,
          },
        });
      }
    });
  }
  // ================= PRESENCE =================
  broadcastPresence(userId: string, isOnline: boolean) {
    console.log('broadcastPresence', userId);
    const contacts = this.userContacts.get(userId);
    if (!contacts) return;

    contacts.forEach((contactId) => {
      if (!this.users.has(contactId)) return;

      this.sendToUser(contactId, {
        type: 'presence',
        payload: { senderId: userId, receiverId: contactId, isOnline },
      });
    });
  }

  handleConnection(userId: string) {
    console.log('handleConnection', userId);
  }

  handleDisconnect(userId: string) {
    console.log('handleDisconnect', userId);
    this.broadcastPresence(userId, false);
  }

  // ================= CONVERSATION =================

  joinConversation(userId: string, receiverId: string, conversationId: string) {
    console.log('joinConversation', userId);

    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, new Set());
    }

    this.conversations.get(conversationId)!.add(userId);
    this.conversations.get(conversationId)!.add(receiverId);
    this.sendToUser(userId, {
      type: 'new_conversation',
      payload: {
        receiverId,
        conversationId,
      },
    });
  }

  // isInConversation(userId: string, otherUserId: string) {
  isInConversation(userId: string, conversationId: string) {
    console.log('isInConversation', userId, conversationId);
    return this.conversations.get(conversationId)?.has(userId);
  }

  async handleChat(userId: string, payload: any) {
    const { receiverId, conversationId, content } = payload;
    console.log('01212121212', payload);

    if (userId === receiverId) {
      return this.sendToUser(userId, {
        type: 'error',
        payload: { message: 'You cannot send message to yourself' },
      });
    }

    if (!this.isInConversation(userId, conversationId)) {
      return this.sendToUser(userId, {
        type: 'error',
        payload: { message: 'Join conversation first' },
      });
    }

    try {
      const message = await this.messageService.createMessage(
        userId,
        receiverId,
        conversationId,
        content,
      );

      [userId, receiverId].forEach((uid) => {
        this.sendToUser(uid, {
          type: 'new_message',
          payload: message,
        });
      });
    } catch (err) {
      this.sendToUser(userId, {
        type: 'error',
        payload: { message: 'Failed to send message' },
      });
    }
  }
  // ================= TYPING =================
  handleTyping(userId: string, payload: any) {
    const { receiverId, conversationId, isTyping } = payload;

    if (!this.isInConversation(userId, conversationId)) return;

    this.sendToUser(receiverId, {
      type: 'typing',
      payload: {
        receiverId: userId,
        isTyping,
      },
    });
  }
  // ================= ROUTER =================
  handleMessage(userId: string, data: any) {
    let msg;

    try {
      msg = JSON.parse(data.toString());
    } catch {
      return;
    }
    console.log('init_conversations', msg.payload);

    switch (msg.type) {
      case 'check_user_status':
        const targetId = msg.payload.userId;

        this.sendToUser(userId, {
          type: 'presence',
          payload: {
            userId: targetId,
            isOnline: this.users.has(targetId),
          },
        });
        break;
      case 'init_conversations':
        console.log('init_conversations', msg.payload);
        this.initConversations(userId, msg.payload);
        break;
      case 'join':
        console.log('join', msg.payload);
        this.joinConversation(
          userId,
          msg.payload.receiverId,
          msg.payload.conversationId,
        );
        break;

      case 'open_chat':
        console.log('open_chat', msg);
        this.sendToUser(userId, {
          type: 'presence',
          payload: {
            receiverId: msg.payload.receiverId,
            userId: userId,
            isOnline: this.users.has(msg.payload.receiverId),
          },
        });
        break;
      case 'typing': // ✅ جديد
        this.handleTyping(userId, msg.payload);
        break;

      case 'send_message':
        console.log('send_message', msg.payload);

        this.handleChat(userId, msg.payload);
        break;
    }
  }

  broadcastPresence2(userId: string, isOnline: boolean) {
    const contacts = this.userContacts.get(userId);
    if (!contacts) return;

    contacts.forEach((contactId) => {
      if (!this.users.has(contactId)) return;

      this.sendToUser(contactId, {
        type: 'presence',
        payload: {
          userId: userId,
          isOnline,
        },
      });
    });
  }
  // ================= SEND =================
  sendToUser(userId: string, data: any) {
    console.log('sendToUser', userId, data);
    const sockets = this.users.get(userId);
    if (!sockets) return;

    sockets.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      }
    });
  }
}
