/*
  Warnings:

  - You are about to drop the column `technicalManualUrl` on the `product_images` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "technicalManualUrl";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "technicalManualUrl" TEXT;
