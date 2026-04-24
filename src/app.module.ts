import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guard/authGuard';
import { RolesGuard } from './guard/RolesGuard';
import { PostModule } from './post/post.module';
import { AuthModule } from './auth/auth.module';
import { ExamModule } from './exam/exam.module';
import { LikeModule } from './like/like.module';
import { NoteModule } from './note/note.module';
import { UserModule } from './user/user.module';
import { LessonModule } from './lesson/lesson.module';
import { PrismaServiceModule } from './prisma.module';
import { CommentModule } from './comment/comment.module';
import { FollowerModule } from './follower/follower.module';
import { HomeWorkModule } from './home-work/home-work.module';
import { WeeklyScheduleModule } from './weekly-schedule/weekly-schedule.module';
import { CourseModule } from './course/course.module';
import { ReviewModule } from './review/review.module';
import { BookedLessonModule } from './bookedLesson/booked-lesson.module';
import { BookedWeeklyModule } from './bookedWeekly/booked.weekly.module';
import { NonceMiddleware } from './middleware/none';
// import { HomeController } from './homePage.controller';

@Module({
  imports: [
    PrismaServiceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    PostModule,
    ExamModule,
    LikeModule,
    NoteModule,
    ReviewModule,
    LessonModule,
    CourseModule,
    CommentModule,
    FollowerModule,
    HomeWorkModule,
    BookedLessonModule,
    BookedWeeklyModule,
    WeeklyScheduleModule,
  ],
  // controllers: [HomeController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(NonceMiddleware).forRoutes('*'); // أو فقط للمسار /
  }
}
