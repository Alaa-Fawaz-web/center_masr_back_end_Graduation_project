import { Injectable } from '@nestjs/common';
// import { CreateNotificationDto } from './dto/create-notification.dto';
// import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, message: string) {
    return this.prisma.notifications.create({
      data: { userId, message },
    });
  }

  async getAll(userId: string) {
    return this.prisma.notifications.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
