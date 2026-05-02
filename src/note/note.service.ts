import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';
import { GetAllLessonDto } from 'src/lesson/dto/getAllLessonDto';
import QueryDto from 'src/validators/query.dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  async findOne(noteId: string, currentUserId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
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

    if (!note) throw new NotFoundException('Note not found');

    const {
      lesson: { bookingLesson, title },
      id,
      fileUrl,
      teacherId,
    } = note;

    let isBooked = teacherId === currentUserId || bookingLesson.length > 0;

    if (!isBooked)
      throw new NotFoundException('Note not found or not authorized');

    return sendResponsive(
      {
        id,
        fileUrl,
        title,
      },
      'Note retrieved successfully',
    );
  }

  async findAll(queryDto: QueryDto, currentUserId: string, title?: string) {
    const { id: courseId, page = 1 } = queryDto;

    const limit = 6;
    const skip = (page - 1) * limit;

    const whereTitle = title
      ? {
          ...(title && {
            title: {
              contains: title,
              mode: 'insensitive',
            },
          }),
        }
      : {};

    const notes = await this.prisma.note.findMany({
      where: { courseId, ...whereTitle },
      skip,
      take: limit,
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

    if (!notes.length) throw new NotFoundException('Notes not found');

    return sendResponsive(
      {
        meta: {
          total: notes.length,
          page,
        },
        courseId,
        data: notes.map((note) => {
          const isBooked =
            note.teacherId === currentUserId ||
            note.lesson.bookingLesson.length > 0;

          return {
            id: note.id,
            lessonId: note.lessonId,
            title: note.lesson.title,
            isBooked,
          };
        }),
      },
      'Notes retrieved successfully',
    );
  }

  async create(
    teacherId: string,
    lessonId: string,
    createNoteDto: CreateNoteDto,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id_teacherId: {
            id: lessonId,
            teacherId,
          },
        },
        select: {
          id: true,
          courseId: true,
        },
      });

      if (!lesson?.id) throw new NotFoundException('Lesson Not Found');

      const [note] = await Promise.all([
        prisma.note.create({
          data: {
            ...createNoteDto,
            lessonId,
            teacherId,
            courseId: lesson.courseId,
          },
        }),

        prisma.course.update({
          where: {
            id_teacherId: {
              id: lesson.courseId,
              teacherId,
            },
          },
          data: {
            noteCounts: { increment: 1 },
          },
        }),
      ]);

      return sendResponsive(note, 'Note create successfully');
    });
  }

  async update(
    noteId: string,
    teacherId: string,
    updateNoteDto: CreateNoteDto,
  ) {
    await this.prisma.note.update({
      where: {
        id_teacherId: {
          id: noteId,
          teacherId,
        },
      },
      data: updateNoteDto,
    });

    return sendResponsive(null, 'Note updated successfully');
  }

  async remove(noteId: string, teacherId: string) {
    return this.prisma.$transaction(async (prisma) => {
      const note = await prisma.note.delete({
        where: {
          id_teacherId: {
            id: noteId,
            teacherId,
          },
        },
        select: {
          courseId: true,
        },
      });
      if (!note)
        throw new NotFoundException('Note not found or not authorized');
      await prisma.course.update({
        where: {
          id: note.courseId,
        },
        data: {
          noteCounts: {
            decrement: 1,
          },
        },
      });

      return sendResponsive(null, 'Note deleted successfully');
    });
  }
}
