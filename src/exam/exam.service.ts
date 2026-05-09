import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';
import { GetAllLessonDto } from 'src/lesson/dto/getAllLessonDto';

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async findOne(currentUserId: string, examId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
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
              where: { studentId: currentUserId },
              select: {
                id: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!exam) return sendResponsive(null, 'Exam not found or not authorized');
    const {
      lesson: { bookingLesson, title },
      id,
      fileUrl,
      teacherId,
    } = exam;

    let isBooked = teacherId === currentUserId || bookingLesson.length > 0;

    if (!isBooked)
      throw new NotFoundException('Exam not found or not authorized');
    return sendResponsive(
      {
        id,
        fileUrl,
        title,
      },
      'Get Exam successfully',
    );
  }

  async findAll(
    courseId: string,
    currentUserId: string,
    getAllExamDto: GetAllLessonDto,
  ) {
    const whereExam = getAllExamDto.title
      ? {
          ...(getAllExamDto.title && {
            title: {
              contains: getAllExamDto.title,
              mode: 'insensitive',
            },
          }),
        }
      : {};

    const exams = await this.prisma.exam.findMany({
      where: { courseId, ...whereExam },
      select: {
        id: true,
        timeEnd: true,
        duration: true,
        lessonId: true,
        teacherId: true,
        createdAt: true,
        lesson: {
          select: {
            id: true,
            title: true,
            bookingLesson: {
              where: { studentId: currentUserId },
              select: { id: true },
              take: 1,
            },
          },
        },
      },
    });

    if (exams.length === 0) return sendResponsive(null, 'Exams not found');
    return sendResponsive(
      exams.map((exam) => {
        const {
          lesson: { bookingLesson, title },
          lessonId,
          teacherId,
          ...data
        } = exam;

        let isBooked = teacherId === currentUserId || bookingLesson.length > 0;

        return {
          ...data,
          title,
          isBooked: isBooked,
        };
      }),
      'Get All Exams successfully',
    );
  }

  async create(
    teacherId: string,
    lessonId: string,
    createExamDto: CreateExamDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id_teacherId: {
            id: lessonId,
            teacherId,
          },
        },
        select: { id: true, courseId: true },
      });

      if (!lesson)
        throw new NotFoundException('Lesson Not Found or Not authorized');

      const exam = await prisma.exam.create({
        data: {
          ...createExamDto,
          lessonId,
          teacherId,
          courseId: lesson.courseId,
        },
        select: {
          id: true,
          fileUrl: true,
          lessonId: true,
          lesson: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      prisma.course.update({
        where: {
          id_teacherId: {
            id: lesson.courseId,
            teacherId,
          },
        },
        data: {
          examCounts: { increment: 1 },
        },
      });

      return sendResponsive(exam, 'Exam created successfully');
    });
  }

  async update(
    examId: string,
    teacherId: string,
    updateExamDto: UpdateExamDto,
  ) {
    await this.prisma.exam.update({
      where: {
        id_teacherId: {
          id: examId,
          teacherId,
        },
      },
      data: updateExamDto,
    });

    return sendResponsive(null, 'Exam updated successfully');
  }

  async remove(teacherId: string, examId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const exam = await prisma.exam.delete({
        where: {
          id_teacherId: {
            id: examId,
            teacherId,
          },
        },
        select: {
          courseId: true,
        },
      });

      if (!exam)
        throw new NotFoundException('Exam not found or not authorized');

      await prisma.course.update({
        where: {
          id_teacherId: {
            id: exam.courseId,
            teacherId,
          },
        },
        data: {
          examCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Exam deleted successfully');
    });
  }
}
