-- AlterTable
ALTER TABLE "BookedWeekly" ADD COLUMN     "centerId" TEXT;

-- AddForeignKey
ALTER TABLE "BookedWeekly" ADD CONSTRAINT "BookedWeekly_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE CASCADE ON UPDATE CASCADE;
