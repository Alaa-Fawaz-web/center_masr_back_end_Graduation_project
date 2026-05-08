/*
  Warnings:

  - You are about to drop the column `teacherId` on the `TeacherDay` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacherByCenterId,weeklyScheduleId,day,time]` on the table `TeacherDay` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `teacherByCenterId` to the `TeacherDay` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeacherDay" DROP CONSTRAINT "TeacherDay_teacherId_fkey";

-- DropIndex
DROP INDEX "TeacherDay_teacherId_weeklyScheduleId_day_time_key";

-- AlterTable
ALTER TABLE "TeacherDay" DROP COLUMN "teacherId",
ADD COLUMN     "teacherByCenterId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeacherDay_teacherByCenterId_weeklyScheduleId_day_time_key" ON "TeacherDay"("teacherByCenterId", "weeklyScheduleId", "day", "time");

-- AddForeignKey
ALTER TABLE "TeacherDay" ADD CONSTRAINT "TeacherDay_teacherByCenterId_fkey" FOREIGN KEY ("teacherByCenterId") REFERENCES "TeacherByCenter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
