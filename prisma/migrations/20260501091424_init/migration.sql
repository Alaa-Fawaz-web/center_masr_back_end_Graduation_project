/*
  Warnings:

  - The `classRoom` column on the `Teacher` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `studyMaterial` column on the `Teacher` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Center" ADD COLUMN     "classRoom" TEXT[];

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "classRoom",
ADD COLUMN     "classRoom" TEXT[],
DROP COLUMN "studyMaterial",
ADD COLUMN     "studyMaterial" TEXT[],
ALTER COLUMN "educationalStage" SET NOT NULL,
ALTER COLUMN "educationalStage" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Teacher_classRoom_studyMaterial_studySystem_idx" ON "Teacher"("classRoom", "studyMaterial", "studySystem");
