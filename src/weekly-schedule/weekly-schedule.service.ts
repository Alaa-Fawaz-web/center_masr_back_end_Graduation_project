import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive, STUDENT, weekDays } from 'src/utils';
import { CreateWeeklyDto } from './dto/create-weekly-schedule.dto';
import { TeacherDayDto } from './dto/TeacherDayDto';

@Injectable()
export class WeeklyScheduleService {
  constructor(private prisma: PrismaService) {}

  async getWeeklySchedule(
    centerId: string,
    classRoom: string,
    currentUserId: string,
    role: string,
  ) {
    const weeklySchedule = await this.prisma.weeklySchedule.findUnique({
      where: {
        centerId_classRoom: {
          centerId,
          classRoom,
        },
      },
      select: {
        id: true,

        teacherDays: {
          orderBy: { time: 'asc' },
          select: {
            id: true,
            day: true,
            time: true,
            centerId: true,

            teacherByCenter: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                classRoom: true,
              },
            },
            bookedWeekly:
              role === STUDENT
                ? {
                    where: { studentId: currentUserId },
                    select: { id: true },
                    take: 1,
                  }
                : false,
          },
        },
      },
    });

    const schedule: Record<string, any[]> = {};

    weekDays.forEach((day) => {
      schedule[day] = [];
    });

    weeklySchedule?.teacherDays.forEach((lesson) => {
      const accessStudent =
        role === STUDENT ? lesson.bookedWeekly.length > 0 : false;
      const isBooked = lesson.centerId === currentUserId || accessStudent;
      schedule[lesson.day].push({
        id: lesson.id,
        time: lesson.time,
        isBooked,

        teacher: lesson.teacherByCenter
          ? {
              id: lesson.teacherByCenter.id,
              name: lesson.teacherByCenter.name,
              classRoom: lesson.teacherByCenter.classRoom,
              imageUrl: lesson.teacherByCenter.imageUrl,
            }
          : null,
      });
    });

    return sendResponsive(
      { weeklyScheduleId: weeklySchedule?.id, schedule },
      'Weekly schedule successfully',
    );
  }

  async createWeeklySchedule(
    centerId: string,
    createWeeklyDto: CreateWeeklyDto,
  ) {
    const { classRoom, dataDays } = createWeeklyDto;

    return this.prisma.$transaction(async (prisma) => {
      const existing = await prisma.weeklySchedule.findUnique({
        where: {
          centerId_classRoom: {
            centerId,
            classRoom,
          },
        },
        select: { id: true },
      });

      if (existing)
        throw new BadRequestException('Weekly schedule already exists');

      const weekly = await prisma.weeklySchedule.create({
        data: {
          centerId,
          classRoom,
        },
        select: {
          id: true,
          centerId: true,
          classRoom: true,
        },
      });

      const teacherIds = [...new Set(dataDays.map((d) => d.teacherByCenterId))];

      const teachers = await prisma.teacherByCenter.findMany({
        where: { id: { in: teacherIds } },
        select: { id: true },
      });

      const validSet = new Set(teachers.map((t) => t.id));

      const invalidIds = teacherIds.filter((id) => !validSet.has(id));

      if (invalidIds.length) {
        throw new BadRequestException('Invalid teacherId(s)');
      }

      await prisma.teacherDay.createMany({
        data: dataDays.map((item) => ({
          teacherByCenterId: item.teacherByCenterId,
          centerId: weekly.centerId,
          day: item.day,
          time: item.time,
          weeklyScheduleId: weekly.id,
        })),
      });

      return sendResponsive(null, 'Weekly schedule created successfully');
    });
  }

  async createtTeacherDayWeeklySchedule(
    centerId: string,
    weeklyScheduleId: string,
    teacherDayDto: TeacherDayDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const weekly = await prisma.weeklySchedule.findUnique({
        where: {
          id_centerId: {
            id: weeklyScheduleId,
            centerId,
          },
        },
        select: { id: true },
      });

      if (!weekly) {
        throw new NotFoundException('Weekly schedule Not Found');
      }

      const teacher = await prisma.teacherByCenter.findUnique({
        where: { id: teacherDayDto.teacherByCenterId },
        select: { id: true },
      });

      if (!teacher) {
        throw new BadRequestException('Invalid teacherId');
      }

      const count = await prisma.teacherDay.count({
        where: {
          weeklyScheduleId,
          day: teacherDayDto.day,
        },
      });

      if (count >= 3) {
        throw new BadRequestException(
          `Cannot add more than 3 sessions for ${teacherDayDto.day}`,
        );
      }

      await prisma.teacherDay.create({
        data: {
          ...teacherDayDto,
          centerId,
          weeklyScheduleId,
        },
      });

      return sendResponsive(null, 'Weekly schedule created successfully');
    });
  }

  async updateWeeklySchedule(id: string, data: any, centerId: string) {
    const teacherDay = await this.prisma.teacherDay.findFirst({
      where: {
        id,
        weeklySchedule: {
          centerId,
        },
      },
      select: { id: true },
    });

    if (!teacherDay) {
      throw new NotFoundException('Teacher day not found or not authorized');
    }

    await this.prisma.teacherDay.update({
      where: { id },
      data,
    });

    return sendResponsive(null, 'Weekly schedule updated successfully');
  }

  async deleteWeeklySchedule(weeklyScheduleId: string, centerId: string) {
    await this.prisma.weeklySchedule.delete({
      where: {
        id_centerId: {
          id: weeklyScheduleId,
          centerId,
        },
      },
    });

    return sendResponsive(null, ' Weekly schedule deleted successfully');
  }

  async deleteTeacherDayWeeklySchedule(teacherDayId: string, centerId: string) {
    await this.prisma.teacherDay.delete({
      where: {
        id: teacherDayId,
        weeklySchedule: {
          centerId,
        },
      },
    });

    return sendResponsive(null, ' Weekly schedule deleted successfully');
  }
}
