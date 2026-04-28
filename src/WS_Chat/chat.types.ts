// chat.types.ts

export type PayloadType =
  | {
      conversationId: string;
      content?: string;
      messageId?: string;
    }
  | string;
export type SocketEvent =
  | {
      type: 'send_message';
      payload: { conversationId: string; content: string };
    }
  | { type: 'join'; payload: string }
  | { type: 'typing'; payload: string }
  | { type: 'seen'; payload: { messageId: string } };

export type RedisMessage =
  | {
      type: 'new_message';
      payload: any;
      conversationId: string;
    }
  | {
      type: 'delivered';
      messageId: string;
      conversationId: string;
    }
  | {
      type: 'seen';
      messageId: string;
      conversationId: string;
    }
  | {
      type: 'presence';
      userId: string;
      status: 'online' | 'offline';
    };
