/*
  Warnings:

  - You are about to drop the `booking_inventory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inventory_id` to the `booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "booking_inventory" DROP CONSTRAINT "booking_inventory_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_inventory" DROP CONSTRAINT "booking_inventory_inventory_id_fkey";

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "inventory_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "booking_inventory";

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
