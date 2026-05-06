import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';

@Injectable()
export class BookedLessonService {
  constructor(private prisma: PrismaService) {}

  async toggleBookedStudent(studentId: string, lessonId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { teacherId: true },
      });

      if (!lesson) throw new NotFoundException('Lesson not found');

      const existing = await prisma.bookedLesson.findUnique({
        where: {
          studentId_lessonId: {
            studentId,
            lessonId,
          },
        },
      });

      // 🔴 لو موجود → احذف
      if (existing) {
        await prisma.bookedLesson.delete({
          where: {
            studentId_lessonId: {
              studentId,
              lessonId,
            },
          },
        });

        await prisma.teacher.update({
          where: { id: lesson.teacherId },
          data: {
            studentCounts: { decrement: 1 },
          },
        });

        return sendResponsive(null, 'Lesson unbooked successfully');
      }

      // 🟢 لو مش موجود → اعمل create
      await prisma.bookedLesson.create({
        data: { lessonId, studentId },
      });

      await prisma.teacher.update({
        where: { id: lesson.teacherId },
        data: {
          studentCounts: { increment: 1 },
        },
      });

      return sendResponsive(null, 'Lesson booked successfully');
    });
  }
}
