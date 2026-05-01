import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server, WebSocket } from 'ws';
import { MessageService } from './Message.service';
import { ConversationService } from './Conversation.service';
// import { ConversationController } from './Conversation.controller';

@Injectable()
export class ChatWsService implements OnModuleInit, OnModuleDestroy {
  private wss: Server;
  private httpServer: any;

  constructor(
    private messageService: MessageService,
    // private conversationService: ConversationService,

    // private conversationController: ConversationController,
  ) {}
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
      // const conversation =
      //   await this.conversationService.getAllConversation(userId);
      // console.log(conversation);
      this.addUser(userId, socket);
      // this.sendToUser(userId, {
      //   type: 'new_AllConversation',
      //   payload: conversation,
      // });
      this.handleConnection(userId);

      socket.on('message', (data) => {
        console.log('message', data);
        this.handleMessage(userId, data);
      });

      socket.on('close', () => {
        console.log('❌ DISCONNECT:', userId);
        this.removeUser(userId, socket);
        this.handleDisconnect(userId);
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

  // ================= PRESENCE =================
  broadcastPresence(userId: string, isOnline: boolean) {
    console.log('broadcastPresence', userId, isOnline);
    const contacts = this.userContacts.get(userId);
    if (!contacts) return;

    contacts.forEach((contactId) => {
      this.sendToUser(contactId, {
        type: 'presence',
        payload: { userId, isOnline },
      });
    });
  }

  handleConnection(userId: string) {
    // this.conversationController.getAllConversations(userId);

    console.log('handleConnection', userId);
    this.broadcastPresence(userId, true);
  }

  handleDisconnect(userId: string) {
    console.log('handleDisconnect', userId);
    this.broadcastPresence(userId, false);
  }

  // ================= CONVERSATION =================
  // getConvKey(a: string, b: string) {
  //   console.log('getConvKey', a, b);
  //   return [a, b].sort().join('_');
  // }

  // joinConversation(userId: string, otherUserId: string) {

  joinConversation(userId: string, receiverId: string, conversationId: string) {
    // console.log('joinConversation', userId, otherUserId);
    console.log('joinConversation', userId, conversationId);
    // const key = this.getConvKey(userId, otherUserId);

    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, new Set());
    }

    this.conversations.get(conversationId)!.add(userId);
    this.conversations.get(conversationId)!.add(receiverId);
    this.sendToUser(userId, {
      type: 'new_conversation',
      payload: {
        receiverId,
        // userId: receiverId,
        conversationId,
      },
    });
  }

  // isInConversation(userId: string, otherUserId: string) {
  isInConversation(userId: string, conversationId: string) {
    console.log('isInConversation', userId, conversationId);
    // console.log('isInConversation', userId, otherUserId);
    // const key = this.getConvKey(userId, otherUserId);
    return this.conversations.get(conversationId)?.has(userId);
  }

  // ================= CHAT =================
  // handleChat(userId: string, payload: any) {
  //   const { receiverId, content } = payload;
  //   console.log('handleChat', receiverId, content);

  //   if (userId === receiverId) {
  //     return this.sendToUser(userId, {
  //       type: 'error',
  //       payload: { message: 'You can not send message to yourself' },
  //     });
  //   }
  //   if (!this.isInConversation(userId, receiverId)) {
  //     return this.sendToUser(userId, {
  //       type: 'error',
  //       payload: { message: 'Join conversation first' },
  //     });
  //   }

  //   const message = {
  //     id: this.getConvKey(userId, receiverId),
  //     senderId: userId,
  //     receiverId: receiverId,
  //     content,
  //   };

  //   [userId, receiverId].forEach((uid) => {
  //     this.sendToUser(uid, {
  //       type: 'new_message',
  //       payload: message,
  //     });
  //   });
  // }

  async handleChat(userId: string, payload: any) {
    const { receiverId, conversationId, content } = payload;

    // ❌ حماية
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
      // ✅ استنى الحفظ في DB
      const message = await this.messageService.createMessage(
        userId,
        receiverId,
        conversationId,
        content,
      );

      // ✅ لو نجح → ابعت
      [userId, receiverId].forEach((uid) => {
        this.sendToUser(uid, {
          type: 'new_message',
          payload: message, // 👈 رجع من DB
        });
      });
    } catch (err) {
      console.log('❌ DB ERROR:', err!.message);

      // ❌ متبعتش رسالة
      this.sendToUser(userId, {
        type: 'error',
        payload: { message: 'Failed to send message' },
      });
    }
  }
  // async handleChat(userId: string, payload: any) {
  //   const { receiverId, content } = payload;

  //   const createMessage = await this.messageService.createMessage(
  //     userId,
  //     receiverId,
  //     content,
  //   );
  //   console.log('012121112121', createMessage);

  //   const message = {
  //     id: this.getConvKey(userId, receiverId),
  //     senderId: userId,
  //     receiverId,
  //     content,
  //   };

  //   [userId, receiverId].forEach((uid) => {
  //     this.sendToUser(uid, {
  //       type: 'new_message',
  //       payload: message,
  //     });
  //   });
  // }

  // ================= ROUTER =================
  handleMessage(userId: string, data: any) {
    let msg;

    try {
      msg = JSON.parse(data.toString());
    } catch {
      return;
    }

    switch (msg.type) {
      // case 'set_contacts':
      //   console.log('set_contacts', msg.payload);
      //   this.setUserContacts(userId, msg.payload.contacts);
      //   break;

      case 'join':
        console.log('join', msg.payload);
        this.joinConversation(
          userId,
          msg.payload.receiverId,
          msg.payload.conversationId,
        );
        break;

      case 'open_chat':
        console.log('open_chat', msg.payload);
        this.sendToUser(userId, {
          type: 'presence',
          payload: {
            receiverId: msg.payload.receiverId,
            // userId: msg.payload.otherUserId,
            isOnline: this.users.has(msg.payload.receiverId),
          },
        });
        break;

      case 'send_message':
        console.log('send_message', msg.payload);

        this.handleChat(userId, msg.payload);
        break;
    }
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
