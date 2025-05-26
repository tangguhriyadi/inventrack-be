/*
  Warnings:

  - You are about to drop the `inventory_item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory_item" DROP CONSTRAINT "inventory_item_inventory_id_fkey";

-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "inventory_item";

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "booking_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "return_at" TIMESTAMP(3),
    "approved_at" TIMESTAMP(3),

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_inventory" (
    "booking_id" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0
);

-- CreateIndex
CREATE UNIQUE INDEX "booking_id_key" ON "booking"("id");

-- CreateIndex
CREATE UNIQUE INDEX "booking_inventory_booking_id_inventory_id_key" ON "booking_inventory"("booking_id", "inventory_id");

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_inventory" ADD CONSTRAINT "booking_inventory_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_inventory" ADD CONSTRAINT "booking_inventory_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
