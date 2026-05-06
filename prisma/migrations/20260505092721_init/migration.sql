/*
  Warnings:

  - Added the required column `day` to the `BookedWeekly` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookedWeekly" ADD COLUMN     "day" TEXT NOT NULL;
