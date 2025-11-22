/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `favorite_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorite_suppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "favorite_products" DROP CONSTRAINT "favorite_products_productId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_products" DROP CONSTRAINT "favorite_products_userId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_suppliers" DROP CONSTRAINT "favorite_suppliers_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_suppliers" DROP CONSTRAINT "favorite_suppliers_userId_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "paymentMethod",
DROP COLUMN "paymentStatus";

-- DropTable
DROP TABLE "favorite_products";

-- DropTable
DROP TABLE "favorite_suppliers";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";
