import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Server, WebSocket } from 'ws';
import { SocketEvent } from './chat.types';

@Injectable()
export class ChatWsService implements OnModuleInit, OnModuleDestroy {
  private wss: Server;
  private httpServer: any;

  // 👤 online users
  private users = new Map<string, Set<WebSocket>>();

  // 💬 conversations (runtime)
  private conversations = new Map<string, Set<string>>();

  // 🧾 contacts (from DB)
  private userContacts = new Map<string, Set<string>>();

  setServer(server: any) {
    this.httpServer = server;
  }

  // =============================
  // 🚀 INIT
  // =============================
  onModuleInit() {
    this.wss = new Server({ server: this.httpServer });

    console.log('🚀 WS running');

    this.wss.on('connection', (socket: WebSocket, req: any) => {
      const url = new URL(req.url, 'http://localhost');
      const userId = url.searchParams.get('userId')?.trim();

      if (!userId) return socket.close();

      console.log('🔥 CONNECT:', userId);

      this.addUser(userId, socket);
      this.handleConnection(userId);

      socket.on('message', (data) => this.handleMessage(userId, data, socket));

      socket.on('error', (err) => {
        console.log('⚠️ ERROR:', err.message);
        socket.terminate();
      });

      socket.on('close', () => {
        console.log('❌ DISCONNECT:', userId);
        this.removeUser(userId, socket);
        this.handleDisconnect(userId);
      });
    });
  }

  onModuleDestroy() {
    this.wss?.close();
  }

  // =============================
  // 👤 USERS
  // =============================
  addUser(userId: string, socket: WebSocket) {
    if (!this.users.has(userId)) {
      this.users.set(userId, new Set());
    }

    this.users.get(userId)!.add(socket);
  }

  removeUser(userId: string, socket: WebSocket) {
    const sockets = this.users.get(userId);
    if (!sockets) return;

    sockets.delete(socket);

    if (sockets.size === 0) {
      this.users.delete(userId);
    }
  }

  // =============================
  // 🧾 CONTACTS (FROM DB)
  // =============================
  setUserContacts(userId: string, contacts: string[]) {
    this.userContacts.set(userId, new Set(contacts));
    console.log('this.userContacts', this.userContacts);
  }

  // =============================
  // 🟢 PRESENCE
  // =============================
  broadcastPresence(userId: string, isOnline: boolean) {
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
    // ابعت حالتي للcontacts
    this.broadcastPresence(userId, true);

    // ابعتلي حالة contacts
    const contacts = this.userContacts.get(userId);

    contacts?.forEach((contactId) => {
      const isOnline = this.users.has(contactId);

      this.sendToUser(userId, {
        type: 'presence',
        payload: {
          userId: contactId,
          isOnline,
        },
      });
    });
  }

  handleDisconnect(userId: string) {
    this.broadcastPresence(userId, false);
  }

  // =============================
  // 💬 CONVERSATION
  // =============================
  getConvKey(a: string, b: string) {
    return [a, b].sort().join('_');
  }

  joinConversation(userId: string, otherUserId: string) {
    const key = this.getConvKey(userId, otherUserId);

    if (!this.conversations.has(key)) {
      this.conversations.set(key, new Set());
    }

    // this.handleConnection(userId);
    this.conversations.get(key)!.add(userId);
    this.conversations.get(key)!.add(otherUserId);
  }

  isInConversation(userId: string, otherUserId: string) {
    const key = this.getConvKey(userId, otherUserId);
    return this.conversations.get(key)?.has(userId);
  }

  // =============================
  // 💬 CHAT
  // =============================
  handleChat(userId: string, payload: any) {
    const { toUserId, content } = payload;

    console.log(userId, toUserId);

    console.log(this.isInConversation(userId, toUserId));

    if (!this.isInConversation(userId, toUserId)) {
      return this.sendToUser(userId, {
        type: 'error',
        payload: { message: 'Join conversation first' },
      });
    }

    const message = {
      id: Date.now(),
      senderId: userId,
      content,
    };

    // this.sendToUser(toUserId, {
    //   type: 'new_message',
    //   payload: message,
    // });
    [userId, toUserId].forEach((uid) => {
      this.sendToUser(uid, {
        type: 'new_message',
        payload: message,
      });
    });
  }

  // =============================
  // 💬 OPEN CHAT (🔥 مهم)
  // =============================
  handleOpenChat(userId: string, otherUserId: string) {
    const isOnline = this.users.has(otherUserId);

    this.sendToUser(userId, {
      type: 'presence',
      payload: {
        userId: otherUserId,
        isOnline,
      },
    });
  }

  // =============================
  // 🔔 NOTIFICATIONS
  // =============================
  notifyStudents(payload: any) {
    const students = ['2', '3', '4']; // من DB

    students.forEach((id) => {
      this.sendToUser(id, {
        type: 'notification',
        payload,
      });
    });
  }

  handleBusinessEvent(msg: any) {
    switch (msg.payload.type) {
      case 'create_lesson':
        this.notifyStudents({
          title: 'New Lesson',
          message: msg.payload.title,
        });
        break;

      case 'create_post':
        this.notifyStudents({
          title: 'New Post',
          message: msg.payload.title,
        });
        break;
    }
  }

  // =============================
  // 📩 ROUTER
  // =============================
  handleMessage(userId: string, data: any, socket: WebSocket) {
    let msg: SocketEvent;

    try {
      msg = JSON.parse(data.toString());
    } catch {
      return;
    }

    switch (msg.type) {
      case 'set_contacts':
        this.setUserContacts(userId, msg.payload.contacts);
        this.handleConnection(userId);
        break;

      case 'open_chat':
        this.handleOpenChat(userId, msg.payload.otherUserId);
        break;

      case 'join':
        this.joinConversation(userId, msg.payload.otherUserId);
        break;

      case 'send_message':
        this.handleChat(userId, msg.payload);
        break;

      case 'business_event':
        this.handleBusinessEvent(msg);
        break;
    }
  }

  // =============================
  // 📤 SEND
  // =============================
  sendToUser(userId: string, data: any) {
    const sockets = this.users.get(userId);
    if (!sockets) return;

    sockets.forEach((socket) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      }
    });
  }
}
