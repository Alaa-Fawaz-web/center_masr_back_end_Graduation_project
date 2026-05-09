import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class TeacherDashboardService {
  constructor(private prisma: PrismaService) {}

  async findAllStudents(teacherId: string, page = 1, limit = 3) {
    const [bookings, studentCounts] = await Promise.all([
      this.prisma.bookedLesson.findMany({
        where: { lesson: { teacherId: teacherId } },
        distinct: ['studentId'],
        select: {
          id: true,
          createdAt: true,
          student: {
            select: {
              user: {
                select: {
                  name: true,
                  imageUrl: true,
                },
              },
            },
          },
          lesson: {
            select: {
              course: {
                select: {
                  title: true,
                  classRoom: true,
                },
              },
            },
          },
        },
        // skip: (page - 1) * limit,
        // take: limit,
      }),

      this.prisma.teacher.findUnique({
        where: { id: teacherId },
        select: {
          studentCounts: true,
        },
      }),
    ]);

    console.log(bookings, studentCounts);
    return sendResponsive(
      { studentCounts: studentCounts?.studentCounts, bookings },
      bookings.length ? 'Bookings retrieved successfully' : 'No bookings found',
    );
  }
}
