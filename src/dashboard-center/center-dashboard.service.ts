import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';
import { CreateTeachersDto } from './dto/CreateTeachersDto';

@Injectable()
export class CenterDashboardService {
  constructor(private prisma: PrismaService) {}

  async createTeachers(centerId: string, createTeahersDto: CreateTeachersDto) {
    await this.prisma.teacherByCenter.create({
      data: { centerId, ...createTeahersDto },
    });

    return sendResponsive(null, 'Get All Teachers successfully');
  }
  async findAllTeacher(
    centerId: string,
    name?: string,
    educationalStage?: string,
  ) {
    const where =
      educationalStage || name
        ? { centerId, educationalStage, user: { name } }
        : { centerId };

    const teachers = await this.prisma.teacherByCenter.findMany({
      where,
      select: {
        classRoom: true,
        sharePrice: true,
        studyMaterial: true,
        studySystem: true,
        center: {
          select: {
            user: {
              select: {
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      take: 10,
    });
    return sendResponsive(teachers || [], 'Get All Teachers successfully');
  }

  async findAllStudents(teacherId: string, page = 1, limit = 3) {
    const [bookings, studentCounts] = await Promise.all([
      this.prisma.bookedWeekly.findMany({
        where: { centerId: teacherId },
        select: {
          id: true,
          student: {
            select: {
              classRoom: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          teacherDay: {
            select: {
              teacherByCenter: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.teacher.findUnique({
        where: { id: teacherId },
        select: {
          studentCounts: true,
        },
      }),
    ]);

    return sendResponsive(
      { studentCounts: studentCounts?.studentCounts || 0, bookings },
      bookings.length ? 'Bookings retrieved successfully' : 'No bookings found',
    );
  }
}
