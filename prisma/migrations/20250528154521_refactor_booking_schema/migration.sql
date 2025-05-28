-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'RETURNED');

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'PENDING';
