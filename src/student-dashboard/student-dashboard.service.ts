import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

const select = {
  id: true,
  lesson: {
    select: {
      id: true,
      title: true,
      teacher: {
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  },
};

@Injectable()
export class StudentDashboardService {
  constructor(private prisma: PrismaService) {}

  async findAllLessons(studentId: string, page = 1, limit = 9) {
    const bookings = await this.prisma.bookedLesson.findMany({
      where: { studentId },
      skip: (page - 1) * limit,
      take: limit,
      select,
      orderBy: { createdAt: 'desc' },
    });

    return sendResponsive(
      bookings,
      bookings.length ? 'Lessons retrieved successfully' : 'No lessons found',
    );
  }

  async findAllShares(studentId: string, page = 1, limit = 3) {
    const bookings = await this.prisma.bookedWeekly.findMany({
      where: { studentId },
      select: {
        id: true,
        teacherDay: {
          select: {
            id: true,
            day: true,
            time: true,
            center: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            teacher: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return sendResponsive(
      bookings,
      bookings.length ? 'Bookings retrieved successfully' : 'No bookings found',
    );
  }

  async findAllExamHomeWorke(studentId: string, page = 1, limit = 5) {
    const examAndHomework = await this.prisma.bookedLesson.findMany({
      where: {
        studentId,
      },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        lesson: {
          select: {
            id: true,
            title: true,
            exam: {
              select: {
                id: true,
              },
            },
            homework: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    return sendResponsive(
      examAndHomework,
      examAndHomework.length ? 'Data retrieved successfully' : 'No data found',
    );
  }
}
