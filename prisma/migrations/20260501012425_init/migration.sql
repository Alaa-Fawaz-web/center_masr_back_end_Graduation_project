-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'teacher', 'student', 'center');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "followerCounts" INTEGER NOT NULL DEFAULT 0,
    "followingCounts" INTEGER NOT NULL DEFAULT 0,
    "postCounts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userAId" TEXT NOT NULL,
    "userBId" TEXT NOT NULL,
    "lastMessage" TEXT NOT NULL,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "classRoom" TEXT,
    "studyMaterial" TEXT,
    "studySystem" TEXT[],
    "educationalStage" TEXT[],
    "star" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "bio" TEXT,
    "experienceYear" INTEGER NOT NULL DEFAULT 0,
    "courseCounts" INTEGER NOT NULL DEFAULT 0,
    "lessonCounts" INTEGER NOT NULL DEFAULT 0,
    "noteCounts" INTEGER NOT NULL DEFAULT 0,
    "homeworkCounts" INTEGER NOT NULL DEFAULT 0,
    "examCounts" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "educationalStage" TEXT,
    "classRoom" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileTeacher" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "whatsApp" TEXT,
    "sharePrice" INTEGER NOT NULL DEFAULT 0,
    "centersWhereHeStudie" TEXT[],
    "educationalQualification" TEXT,

    CONSTRAINT "ProfileTeacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Center" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "governorate" TEXT,
    "educationalStage" TEXT[],
    "studySystem" TEXT[],
    "star" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Center_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileCenter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "whatsApp" TEXT,
    "contactUsPhone" TEXT[],
    "contactUsEmail" TEXT[],
    "studyMaterials" TEXT[],

    CONSTRAINT "ProfileCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "rate" INTEGER NOT NULL DEFAULT 0,
    "ownerReviewId" TEXT NOT NULL,
    "userReviewId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "studyMaterial" TEXT NOT NULL,
    "classRoom" TEXT NOT NULL,
    "studentCounts" INTEGER NOT NULL DEFAULT 0,
    "lessonCounts" INTEGER NOT NULL DEFAULT 0,
    "noteCounts" INTEGER NOT NULL DEFAULT 0,
    "examCounts" INTEGER NOT NULL DEFAULT 0,
    "homeworkCounts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "videoUrl" TEXT,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookedLesson" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,

    CONSTRAINT "BookedLesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homework" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Homework_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklySchedule" (
    "id" TEXT NOT NULL,
    "centerId" TEXT NOT NULL,
    "classRoom" TEXT NOT NULL,

    CONSTRAINT "WeeklySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeacherDay" (
    "id" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "weeklyScheduleId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "studyMaterial" TEXT NOT NULL,
    "centerId" TEXT,

    CONSTRAINT "TeacherDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookedWeekly" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "teacherDayId" TEXT NOT NULL,

    CONSTRAINT "BookedWeekly_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "likeCounts" INTEGER NOT NULL DEFAULT 0,
    "commentCounts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follower" (
    "id" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,

    CONSTRAINT "Follower_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_userAId_userBId_key" ON "Conversation"("userAId", "userBId");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_userId_key" ON "Teacher"("userId");

-- CreateIndex
CREATE INDEX "Teacher_classRoom_studyMaterial_studySystem_idx" ON "Teacher"("classRoom", "studyMaterial", "studySystem");

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_key" ON "Student"("userId");

-- CreateIndex
CREATE INDEX "Student_classRoom_educationalStage_idx" ON "Student"("classRoom", "educationalStage");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileTeacher_userId_key" ON "ProfileTeacher"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Center_userId_key" ON "Center"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileCenter_userId_key" ON "ProfileCenter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "Review_ownerReviewId_idx" ON "Review"("ownerReviewId");

-- CreateIndex
CREATE INDEX "Review_userReviewId_idx" ON "Review"("userReviewId");

-- CreateIndex
CREATE INDEX "Course_teacherId_classRoom_idx" ON "Course"("teacherId", "classRoom");

-- CreateIndex
CREATE UNIQUE INDEX "Course_id_teacherId_key" ON "Course"("id", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Course_studyMaterial_classRoom_teacherId_key" ON "Course"("studyMaterial", "classRoom", "teacherId");

-- CreateIndex
CREATE INDEX "Lesson_courseId_title_idx" ON "Lesson"("courseId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_id_teacherId_key" ON "Lesson"("id", "teacherId");

-- CreateIndex
CREATE INDEX "BookedLesson_lessonId_studentId_idx" ON "BookedLesson"("lessonId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "BookedLesson_studentId_lessonId_key" ON "BookedLesson"("studentId", "lessonId");

-- CreateIndex
CREATE INDEX "Note_courseId_idx" ON "Note"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_id_teacherId_key" ON "Note"("id", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_teacherId_lessonId_courseId_key" ON "Note"("teacherId", "lessonId", "courseId");

-- CreateIndex
CREATE INDEX "Homework_courseId_idx" ON "Homework"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_id_teacherId_key" ON "Homework"("id", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Homework_teacherId_lessonId_courseId_key" ON "Homework"("teacherId", "lessonId", "courseId");

-- CreateIndex
CREATE INDEX "Exam_courseId_idx" ON "Exam"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_id_teacherId_key" ON "Exam"("id", "teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "Exam_teacherId_lessonId_courseId_key" ON "Exam"("teacherId", "lessonId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySchedule_id_centerId_key" ON "WeeklySchedule"("id", "centerId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySchedule_centerId_classRoom_key" ON "WeeklySchedule"("centerId", "classRoom");

-- CreateIndex
CREATE UNIQUE INDEX "TeacherDay_teacherId_weeklyScheduleId_day_time_key" ON "TeacherDay"("teacherId", "weeklyScheduleId", "day", "time");

-- CreateIndex
CREATE INDEX "BookedWeekly_studentId_teacherDayId_idx" ON "BookedWeekly"("studentId", "teacherDayId");

-- CreateIndex
CREATE UNIQUE INDEX "BookedWeekly_studentId_teacherDayId_key" ON "BookedWeekly"("studentId", "teacherDayId");

-- CreateIndex
CREATE INDEX "Post_userId_role_idx" ON "Post"("userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "Post_id_userId_key" ON "Post"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_postId_key" ON "Like"("userId", "postId");

-- CreateIndex
CREATE INDEX "Comment_userId_postId_idx" ON "Comment"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_userId_postId_key" ON "Comment"("id", "userId", "postId");

-- CreateIndex
CREATE INDEX "Follower_followingId_followerId_idx" ON "Follower"("followingId", "followerId");

-- CreateIndex
CREATE UNIQUE INDEX "Follower_followingId_followerId_key" ON "Follower"("followingId", "followerId");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userAId_fkey" FOREIGN KEY ("userAId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userBId_fkey" FOREIGN KEY ("userBId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileTeacher" ADD CONSTRAINT "ProfileTeacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Center" ADD CONSTRAINT "Center_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileCenter" ADD CONSTRAINT "ProfileCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ownerReviewId_fkey" FOREIGN KEY ("ownerReviewId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userReviewId_fkey" FOREIGN KEY ("userReviewId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookedLesson" ADD CONSTRAINT "BookedLesson_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookedLesson" ADD CONSTRAINT "BookedLesson_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Homework" ADD CONSTRAINT "Homework_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklySchedule" ADD CONSTRAINT "WeeklySchedule_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherDay" ADD CONSTRAINT "TeacherDay_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherDay" ADD CONSTRAINT "TeacherDay_weeklyScheduleId_fkey" FOREIGN KEY ("weeklyScheduleId") REFERENCES "WeeklySchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeacherDay" ADD CONSTRAINT "TeacherDay_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookedWeekly" ADD CONSTRAINT "BookedWeekly_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookedWeekly" ADD CONSTRAINT "BookedWeekly_teacherDayId_fkey" FOREIGN KEY ("teacherDayId") REFERENCES "TeacherDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follower" ADD CONSTRAINT "Follower_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
