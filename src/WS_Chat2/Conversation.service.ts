import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

const select = {
  id: true,
  userAId: true,
  userBId: true,
  lastMessage: true,
  lastMessageAt: true,
  createdAt: true,
  userA: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
  },
  userB: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
    },
  },
};

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async createConversation(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new NotFoundException('Invalid users');
    }

    // 🔥 توحيد ترتيب IDs (عشان A,B = B,A)
    const [userAId, userBId] =
      senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];

    // 🔥 upsert (create لو مش موجود / رجّع الموجود لو موجود)
    const conversation = await this.prisma.conversation.upsert({
      where: {
        userAId_userBId: {
          userAId,
          userBId,
        },
      },
      update: {}, // مش محتاج تعدل حاجة
      create: {
        userAId,
        userBId,
      },
      select,
    });

    // 🔥 تحديد مين sender ومين receiver
    const [sender, receiver] =
      conversation.userAId === senderId
        ? [conversation.userA, conversation.userB]
        : [conversation.userB, conversation.userA];

    return sendResponsive(
      {
        id: conversation.id,
        senderId: sender.id,
        receiverId: receiver.id,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        createdAt: conversation.createdAt,
        name: receiver.name,
        imageUrl: receiver.imageUrl,
      },
      'Conversation ready',
    );
  }
  // async createConversation(senderId: string, receiverId: string) {
  //   if (senderId === receiverId) throw new NotFoundException('User not found');
  //   let conversation = await this.prisma.conversation.findFirst({
  //     where: {
  //       OR: [
  //         { AND: [{ userAId: senderId }, { userBId: receiverId }] },
  //         { AND: [{ userAId: receiverId }, { userBId: senderId }] },
  //       ],
  //     },
  //     select,
  //   });

  //   if (!conversation) {
  //     conversation = await this.prisma.conversation.create({
  //       data: {
  //         userAId: senderId,
  //         userBId: receiverId,
  //       },
  //       select,
  //     });
  //   }

  //   console.log(conversation);

  //   const [sender, receiver] =
  //     conversation.userAId === senderId
  //       ? [conversation.userA, conversation.userB]
  //       : [conversation.userB, conversation.userA];

  //   return sendResponsive(
  //     {
  //       id: conversation.id,
  //       senderId: sender.id,
  //       receiverId: receiver.id,
  //       lastMessage: conversation.lastMessage,
  //       lastMessageAt: conversation.lastMessageAt,
  //       createdAt: conversation.createdAt,
  //       name: receiver.name,
  //       imageUrl: receiver.imageUrl,
  //     },
  //     'Create Conversation successfully',
  //   );
  // }
  async getAllConversation(senderId: string) {
    const conversation = await this.prisma.conversation.findMany({
      where: {
        OR: [{ userAId: senderId }, { userBId: senderId }],
      },
      select,
      orderBy: { lastMessageAt: 'desc' },
    });

    return sendResponsive(
      conversation.map((conv) => {
        const [sender, receiver] =
          conv.userAId === senderId
            ? [conv.userA, conv.userB]
            : [conv.userB, conv.userA];
        return {
          id: conv.id,
          senderId: sender.id,
          receiverId: receiver.id,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          createdAt: conv.createdAt,
          name: receiver.name,
          imageUrl: receiver.imageUrl,
        };
      }),
      'Get All Conversations successfully',
    );
  }

  async getAllConversationChat(senderId: string) {
    const conversation = await this.prisma.conversation.findMany({
      where: {
        OR: [{ userAId: senderId }, { userBId: senderId }],
      },
      select: {
        id: true,
        userAId: true,
        userBId: true,
      },
    });

    return conversation.map((conv) => {
      return conv.userAId === senderId ? conv.userBId : conv.userBId;
    });
  }
}
