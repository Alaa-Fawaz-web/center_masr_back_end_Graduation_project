import { Injectable } from '@nestjs/common';
// import { CreateContactDto } from './dto/create-contact.dto';
// import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async getContacts(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: true,
        userB: true,
      },
    });

    return conversations.map((c) => (c.userAId === userId ? c.userB : c.userA));
  }
}
