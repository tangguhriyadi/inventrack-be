/*
  Warnings:

  - Added the required column `image_url` to the `inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "image_url" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "inventory_item" (
    "id" TEXT NOT NULL,
    "inventory_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_item_id_key" ON "inventory_item"("id");

-- AddForeignKey
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
