import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';
import { GetAllLessonDto } from './dto/getAllLessonDto';
import QueryDto from 'src/validators/query.dto';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async getLesson(lessonId: string, currentUserId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        teacherId: true,
        bookingLesson: {
          where: {
            studentId: currentUserId,
          },
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found');
    const isBooked =
      lesson.teacherId === currentUserId || lesson.bookingLesson.length > 0;
    const { bookingLesson, ...reset } = lesson;

    if (!isBooked) throw new ForbiddenException('you are Not Booked in Lesson');
    return sendResponsive(reset, 'Get Lesson successfully');
  }

  async getAllLessons(
    queryDto: QueryDto,
    currentUserId: string,
    getAllLessonsDto: GetAllLessonDto,
  ) {
    const { page = 1, id: courseId } = queryDto;
    const limit = 6;
    const skip = (page - 1) * limit;

    const where: { courseId: string; title?: string } = getAllLessonsDto.title
      ? { courseId, title: getAllLessonsDto.title }
      : { courseId };

    const lessons = await this.prisma.lesson.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        teacherId: true,
        createdAt: true,
        bookingLesson: {
          where: {
            studentId: currentUserId,
          },
          select: { id: true },
          take: 1,
        },
      },
    });

    return sendResponsive(
      {
        meta: {
          total: lessons.length,
          page,
        },
        courseId,
        data: lessons.map((lesson) => {
          const isBooked = lesson.bookingLesson.length > 0;

          return {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            createdAt: lesson.createdAt,
            isBooked: lesson.teacherId === currentUserId || isBooked,
          };
        }),
      },
      'Get All Lesson successfully',
    );
  }

  async createLesson(
    teacherId: string,
    courseId: string,
    createLessonDto: CreateLessonDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const course = await prisma.course.findUnique({
        where: { id_teacherId: { id: courseId, teacherId } },
        select: { id: true },
      });

      if (!course?.id)
        throw new NotFoundException('Course not found or not authorized');

      const [lesson] = await Promise.all([
        prisma.lesson.create({
          data: {
            ...createLessonDto,
            courseId,
            teacherId,
          },
        }),

        prisma.course.update({
          where: { id_teacherId: { id: courseId, teacherId } },
          data: {
            lessonCounts: {
              increment: 1,
            },
          },
        }),
      ]);

      return sendResponsive(lesson, 'Lesson created successfully');
    });
  }

  async updateLesson(
    teacherId: string,
    lessonId: string,
    updateLessonDto: UpdateLessonDto,
  ) {
    await this.prisma.lesson.update({
      where: {
        id_teacherId: {
          id: lessonId,
          teacherId,
        },
      },
      data: updateLessonDto,
    });

    return sendResponsive(null, 'Lesson updated successfully');
  }

  async deleteLesson(teacherId: string, lessonId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.delete({
        where: {
          id_teacherId: {
            id: lessonId,
            teacherId,
          },
        },
        select: {
          courseId: true,
        },
      });
      if (!lesson)
        throw new NotFoundException('Lesson not found or not authorized');

      await prisma.course.update({
        where: {
          id: lesson.courseId,
        },
        data: {
          lessonCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Lesson deleted successfully');
    });
  }
}
