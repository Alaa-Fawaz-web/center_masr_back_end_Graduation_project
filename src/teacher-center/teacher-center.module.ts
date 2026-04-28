import { Module } from '@nestjs/common';
import { TeacherCenterService } from './teacher-center.service';
import { TeacherCenterController } from './teacher-center.controller';

@Module({
  controllers: [TeacherCenterController],
  providers: [TeacherCenterService],
})
export class TeacherCenterModule {}
