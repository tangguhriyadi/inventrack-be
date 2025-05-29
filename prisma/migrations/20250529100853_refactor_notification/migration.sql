/*
  Warnings:

  - You are about to drop the column `is_notified` on the `booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "booking" DROP COLUMN "is_notified",
ADD COLUMN     "is_remind" BOOLEAN NOT NULL DEFAULT false;
