/*
  Warnings:

  - Added the required column `day` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "day" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TeacherByCenter" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "studyMaterial" DROP NOT NULL,
ALTER COLUMN "educationalStage" DROP NOT NULL;
