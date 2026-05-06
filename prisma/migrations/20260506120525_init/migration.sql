/*
  Warnings:

  - Made the column `centerId` on table `BookedWeekly` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BookedWeekly" ALTER COLUMN "centerId" SET NOT NULL;
