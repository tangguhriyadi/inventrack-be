/*
  Warnings:

  - You are about to drop the `booking_approve` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `booking_reject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `booking_return` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_approve" DROP CONSTRAINT "booking_approve_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_reject" DROP CONSTRAINT "booking_reject_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_return" DROP CONSTRAINT "booking_return_booking_id_fkey";

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "is_approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_done" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_rejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_returned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejected_at" TIMESTAMP(3),
ADD COLUMN     "returned_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "booking_approve";

-- DropTable
DROP TABLE "booking_reject";

-- DropTable
DROP TABLE "booking_return";
