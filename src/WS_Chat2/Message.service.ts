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
    return await this.prisma.message.create({
      data: {
        senderId,
        receiverId,
        content,
        conversationId,
      },
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
