// chat.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createMessage(userId: string, conversationId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        content,
        senderId: userId,
        conversationId,
      },
    });

    await this.redis.publish(`chat:${conversationId}`, {
      type: 'new_message',
      payload: message,
    });

    return message;
  }

  async markSeen(messageId: string, conversationId: string) {
    await this.prisma.message.update({
      where: { id: messageId },
      data: { seenAt: new Date() },
    });

    await this.redis.publish(`chat:${conversationId}`, {
      type: 'seen',
      messageId,
    });
  }

  async setOnline(userId: string) {
    await this.redis.pub.set(`online:${userId}`, '1', 'EX', 60);

    await this.redis.publish('presence', {
      userId,
      status: 'online',
    });
  }

  async setOffline(userId: string) {
    await this.redis.pub.del(`online:${userId}`);

    await this.redis.publish('presence', {
      userId,
      status: 'offline',
    });
  }
}
