import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class BookedWeeklyService {
  constructor(private prisma: PrismaService) {}

  async toggleBookedStudent(
    centerId: string,
    studentId: string,
    teacherDayId: string,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.bookedWeekly.findUnique({
        where: {
          studentId_teacherDayId: {
            studentId,
            teacherDayId,
          },
        },
      });

      if (existing) {
        await prisma.bookedWeekly.delete({
          where: {
            studentId_teacherDayId: {
              studentId,
              teacherDayId,
            },
          },
        });

        return sendResponsive(null, 'Weekly unbooked successfully');
      }

      await prisma.bookedWeekly.create({
        data: {
          studentId,
          teacherDayId,
          centerId,
        },
      });

      return sendResponsive(null, 'Weekly booked successfully');
    });
  }
}
