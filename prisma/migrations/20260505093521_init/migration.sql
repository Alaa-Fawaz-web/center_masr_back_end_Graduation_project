/*
  Warnings:

  - Added the required column `day` to the `BookedWeekly` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookedWeekly" ADD COLUMN     "day" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TeacherDay" ALTER COLUMN "day" SET DATA TYPE TEXT;
