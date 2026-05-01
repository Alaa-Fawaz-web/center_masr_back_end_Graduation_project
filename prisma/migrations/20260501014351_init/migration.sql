/*
  Warnings:

  - You are about to drop the `ProfileCenter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProfileTeacher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileCenter" DROP CONSTRAINT "ProfileCenter_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileTeacher" DROP CONSTRAINT "ProfileTeacher_userId_fkey";

-- AlterTable
ALTER TABLE "Center" ADD COLUMN     "contactUsEmail" TEXT[],
ADD COLUMN     "contactUsPhone" TEXT[],
ADD COLUMN     "studyMaterials" TEXT[],
ADD COLUMN     "whatsApp" TEXT;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "centersWhereHeStudie" TEXT[],
ADD COLUMN     "educationalQualification" TEXT,
ADD COLUMN     "sharePrice" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "whatsApp" TEXT;

-- DropTable
DROP TABLE "ProfileCenter";

-- DropTable
DROP TABLE "ProfileTeacher";
