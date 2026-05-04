import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma.service';
import { sendResponsive } from 'src/utils';
import GetAllCourseDto from './dto/getAllCourseDto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  async findOne(courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        time: true,
        title: true,
        classRoom: true,
        studyMaterial: true,
      },
    });

    if (!course?.id) return sendResponsive(null, 'Course not found');

    return sendResponsive(course, 'Get Course successfully');
  }

  async findAll(page = 1, teacherId: string, getAllCourseDto: GetAllCourseDto) {
    const limit = 6;
    const skip = (page - 1) * limit;

    const where = getAllCourseDto.classRoom
      ? {
          teacherId,
          classRoom: getAllCourseDto.classRoom,
          title: getAllCourseDto?.title,
        }
      : { teacherId };

    const courses = await this.prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        time: true,
        title: true,
        classRoom: true,
        studyMaterial: true,
        lessonCounts: true,
        studentCounts: true,
      },
    });

    return sendResponsive(
      {
        meta: {
          total: courses.length,
          page,
        },
        courses,
      },
      'Get All courses successfully',
    );
  }

  async create(teacherId: string, createCourseDto: CreateCourseDto) {
    return this.prisma.$transaction(async (prisma) => {
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        select: {
          id: true,
        },
      });

      if (!teacher) throw new NotFoundException('Teacher not found');

      const course = await prisma.course.create({
        data: {
          ...createCourseDto,
          teacherId,
        },
        select: {
          id: true,
          time: true,
          classRoom: true,
          studyMaterial: true,
        },
      });

      if (!course) throw new NotFoundException('Course not created');

      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          courseCounts: { increment: 1 },
        },
      });

      return sendResponsive(course, 'Course created successfully');
    });
  }

  async update(
    courseId: string,
    teacherId: string,
    updateCourseDto: UpdateCourseDto,
  ) {
    await this.prisma.course.update({
      where: {
        id_teacherId: {
          id: courseId,
          teacherId,
        },
      },
      data: {
        ...updateCourseDto,
      },
    });

    return sendResponsive(null, 'Course updated successfully');
  }

  async remove(courseId: string, teacherId: string) {
    return await this.prisma.$transaction(async (prisma) => {
      await Promise.all([
        prisma.course.delete({
          where: {
            id_teacherId: {
              id: courseId,
              teacherId,
            },
          },
        }),
        prisma.teacher.update({
          where: { id: teacherId },
          data: {
            courseCounts: { decrement: 1 },
          },
        }),
      ]);

      return sendResponsive(null, 'Course deleted successfully');
    });
  }
}
