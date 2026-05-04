import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(
    senderId: string,
    receiverId: string,
    conversationId: string,
    content: string,
  ) {
    console.log(conversationId);

    return await this.prisma.$transaction(async (prisma) => {
      const message = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          conversationId,
          content,
        },
      });

      const conversation = await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          lastMessage: content,
          lastMessageAt: new Date(),
        },
      });
      console.log(conversation, 'conversations');

      return message;
    });
  }
  async getMessage(senderId: string, receiverId: string, page = 1) {
    const skip = (page - 1) * 10;

    const messages = await this.prisma.message.findMany({
      where: {
        OR: [
          {
            senderId,
            receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      skip,
    });

    return sendResponsive(messages.reverse(), 'Get All Messages successfully');
  }
}
