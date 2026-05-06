/*
  Warnings:

  - You are about to drop the column `whatsApp` on the `Center` table. All the data in the column will be lost.
  - You are about to drop the column `whatsApp` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Center" DROP COLUMN "whatsApp",
ADD COLUMN     "whatsPhone" TEXT;

-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "whatsApp",
ADD COLUMN     "whatsPhone" TEXT;
