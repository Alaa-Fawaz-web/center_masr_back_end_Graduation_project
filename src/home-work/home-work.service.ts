import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHomeWorkDto } from './dto/create-home-work.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';
import { GetAllLessonDto } from 'src/lesson/dto/getAllLessonDto';

@Injectable()
export class HomeWorkService {
  constructor(private prisma: PrismaService) {}

  async findOne(homeWorkId: string, currentUserId: string) {
    const homeWork = await this.prisma.homework.findUnique({
      where: { id: homeWorkId },
      select: {
        id: true,
        fileUrl: true,
        lessonId: true,
        teacherId: true,
        lesson: {
          select: {
            id: true,
            title: true,
            bookingLesson: {
              where: {
                studentId: currentUserId,
              },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!homeWork) throw new NotFoundException('Home work not found');

    const {
      lesson: { bookingLesson, title },
      id,
      fileUrl,
      teacherId,
    } = homeWork;

    let isBooked = teacherId === currentUserId || bookingLesson.length > 0;

    if (!isBooked)
      throw new NotFoundException('Exam not found or not authorized');

    return sendResponsive(
      {
        id,
        title,
        fileUrl,
      },
      'Get Home Work successfully',
    );
  }

  async findAll(
    courseId: string,
    currentUserId: string,
    getAllHomeWorkDto: GetAllLessonDto,
  ) {
    const whereHomeWork = getAllHomeWorkDto.title
      ? {
          ...(getAllHomeWorkDto.title && {
            title: {
              contains: getAllHomeWorkDto.title,
              mode: 'insensitive',
            },
          }),
        }
      : {};

    const homeWorks = await this.prisma.homework.findMany({
      where: { courseId, ...whereHomeWork },
      select: {
        id: true,
        lessonId: true,
        teacherId: true,
        lesson: {
          select: {
            id: true,
            title: true,
            bookingLesson: {
              where: {
                studentId: currentUserId,
              },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    });

    if (!homeWorks.length) throw new NotFoundException('Home Works not found');

    return sendResponsive(
      {
        courseId,
        data: homeWorks.map((homeWork) => {
          let isBooked =
            homeWork.teacherId === currentUserId ||
            homeWork.lesson.bookingLesson.length > 0;

          return {
            id: homeWork.id,
            lesson: {
              id: homeWork.lesson.id,
              title: homeWork.lesson.title,
            },
            isBooked,
          };
        }),
      },
      'Home work created successfully',
    );
  }

  async create(
    courseId: string,
    teacherId: string,
    lessonId: string,
    createHomeWorkDto: CreateHomeWorkDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.findUnique({
        where: { id_teacherId: { id: lessonId, teacherId } },
        select: {
          id: true,
        },
      });

      if (!lesson)
        throw new NotFoundException('Lesson not found or not authorized');

      const [homeWork] = await Promise.all([
        prisma.homework.create({
          data: {
            ...createHomeWorkDto,
            courseId,
            lessonId,
            teacherId,
          },
        }),

        prisma.course.update({
          where: {
            id_teacherId: {
              id: courseId,
              teacherId,
            },
          },
          data: {
            homeworkCounts: {
              increment: 1,
            },
          },
        }),
      ]);

      return sendResponsive(homeWork, 'Home work created successfully');
    });
  }

  async update(
    homeWorkId: string,
    teacherId: string,
    updateHomeWorkDto: CreateHomeWorkDto,
  ) {
    await this.prisma.homework.update({
      where: {
        id_teacherId: {
          id: homeWorkId,
          teacherId,
        },
      },
      data: updateHomeWorkDto,
    });

    return sendResponsive(null, 'Home Work updated successfully');
  }
  async remove(homeWorkId: string, teacherId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const homeWork = await prisma.homework.delete({
        where: {
          id_teacherId: {
            id: homeWorkId,
            teacherId,
          },
        },
        select: {
          courseId: true,
        },
      });

      await prisma.course.update({
        where: {
          id_teacherId: { id: homeWork.courseId, teacherId },
        },
        data: {
          homeworkCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Homework deleted successfully');
    });
  }
}
