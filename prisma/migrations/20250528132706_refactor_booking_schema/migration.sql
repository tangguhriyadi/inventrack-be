/*
  Warnings:

  - You are about to drop the column `approved_at` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `reject_reason` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `rejected_at` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `return_at` on the `booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "approved_at",
DROP COLUMN "reject_reason",
DROP COLUMN "rejected_at",
DROP COLUMN "return_at";

-- CreateTable
CREATE TABLE "booking_approve" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "booking_approve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_reject" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_rejected" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "booking_reject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_return" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_returned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "booking_return_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_approve_id_key" ON "booking_approve"("id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_reject_id_key" ON "booking_reject"("id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_return_id_key" ON "booking_return"("id");

-- AddForeignKey
ALTER TABLE "booking_approve" ADD CONSTRAINT "booking_approve_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_reject" ADD CONSTRAINT "booking_reject_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_return" ADD CONSTRAINT "booking_return_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
