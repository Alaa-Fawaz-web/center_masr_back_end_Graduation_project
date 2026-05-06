/*
  Warnings:

  - You are about to drop the column `day` on the `BookedWeekly` table. All the data in the column will be lost.
  - Changed the type of `day` on the `TeacherDay` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "BookedWeekly" DROP COLUMN "day";

-- AlterTable
ALTER TABLE "TeacherDay" DROP COLUMN "day",
ADD COLUMN     "day" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeacherDay_teacherId_weeklyScheduleId_day_time_key" ON "TeacherDay"("teacherId", "weeklyScheduleId", "day", "time");
