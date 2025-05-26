/*
  Warnings:

  - Added the required column `category_id` to the `inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "inventory" ADD COLUMN     "category_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "inventory_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
