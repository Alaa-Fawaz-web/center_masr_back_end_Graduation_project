import { Injectable } from '@nestjs/common';
import { CreateTeacherCenterDto } from './dto/create-teacher-center.dto';
import { UpdateTeacherCenterDto } from './dto/update-teacher-center.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TeacherCenterService {
  constructor(private prisma: PrismaService) {}
  create(createTeacherCenterDto: CreateTeacherCenterDto) {
    // const teacherCenter = this.prisma.teacherCenter.create({
    //   data: createTeacherCenterDto,
    // });
    // return teacherCenter;
  }

  async updateTeacherCenter(
    id: number,
    updateTeacherCenterDto: UpdateTeacherCenterDto,
  ) {
    // const teacherCenter = await this.prisma.teacherCenter.update({
    //   where: {
    //     id,
    //   },
    //   data: updateTeacherCenterDto,
    // });
    // return teacherCenter;
  }

  findAll() {
    return `This action returns all teacherCenter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} teacherCenter`;
  }

  update(id: number, updateTeacherCenterDto: UpdateTeacherCenterDto) {
    return `This action updates a #${id} teacherCenter`;
  }

  remove(id: number) {
    return `This action removes a #${id} teacherCenter`;
  }
}
