-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "approved_by" TEXT,
ADD COLUMN     "rejected_by" TEXT;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_rejected_by_fkey" FOREIGN KEY ("rejected_by") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
