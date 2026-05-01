/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "educationalStage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address";
