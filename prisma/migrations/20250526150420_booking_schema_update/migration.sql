-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "reject_reason" TEXT,
ADD COLUMN     "rejected_at" TIMESTAMP(3);
