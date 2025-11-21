/*
  Warnings:

  - The values [PROCESSING,READY_TO_SHIP,REFUNDED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [REFUNDED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `orderId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `quotationId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `recipient` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `productsCount` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `businessHours` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `companyType` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `totalOrders` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `totalProducts` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `totalQuotations` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `whatsapp` on the `companies` table. All the data in the column will be lost.
  - The primary key for the `favorite_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `addedAt` on the `favorite_products` table. All the data in the column will be lost.
  - The primary key for the `favorite_suppliers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `addedAt` on the `favorite_suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `specifications` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `buyerCompanyId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `buyerNotes` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `cancelledAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDelivery` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `hasReview` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `internalNotes` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentInstallments` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentProof` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTransactionId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `quotationId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingCost` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `subtotal` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `supplierNotes` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `alt` on the `product_images` table. All the data in the column will be lost.
  - You are about to drop the column `compareAtPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `favorites` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `minQuantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `sales` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `seoDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `seoTitle` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `specifications` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `cons` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `helpfulCount` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isVerifiedPurchase` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `isVisible` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `pros` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `ratingCustomerService` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `ratingDeliveryTime` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `ratingProductQuality` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `ratingValueForMoney` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `supplierRespondedAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `supplierRespondedById` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `supplierResponseComment` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `wouldRecommend` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordExpires` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `resetPasswordToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `company_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `helpful_reviews` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotation_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipping_info` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `status_history` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `favorite_products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,supplierId]` on the table `favorite_suppliers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `companyId` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - The required column `id` was added to the `favorite_products` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `favorite_suppliers` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');
ALTER TABLE "public"."orders" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
ALTER TABLE "public"."orders" ALTER COLUMN "paymentStatus" DROP DEFAULT;
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" TYPE "PaymentStatus_new" USING ("paymentStatus"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "orders" ALTER COLUMN "paymentStatus" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_companyId_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_orderId_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_userId_fkey";

-- DropForeignKey
ALTER TABLE "company_categories" DROP CONSTRAINT "company_categories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "company_categories" DROP CONSTRAINT "company_categories_companyId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_products" DROP CONSTRAINT "favorite_products_productId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_products" DROP CONSTRAINT "favorite_products_userId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_suppliers" DROP CONSTRAINT "favorite_suppliers_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "favorite_suppliers" DROP CONSTRAINT "favorite_suppliers_userId_fkey";

-- DropForeignKey
ALTER TABLE "helpful_reviews" DROP CONSTRAINT "helpful_reviews_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "helpful_reviews" DROP CONSTRAINT "helpful_reviews_userId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_orderId_fkey";

-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_buyerCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "quotation_items" DROP CONSTRAINT "quotation_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "quotation_items" DROP CONSTRAINT "quotation_items_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "quotations" DROP CONSTRAINT "quotations_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "quotations" DROP CONSTRAINT "quotations_selectedSupplierId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_companyId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_orderId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_supplierRespondedById_fkey";

-- DropForeignKey
ALTER TABLE "shipping_info" DROP CONSTRAINT "shipping_info_orderId_fkey";

-- DropForeignKey
ALTER TABLE "status_history" DROP CONSTRAINT "status_history_orderId_fkey";

-- DropForeignKey
ALTER TABLE "status_history" DROP CONSTRAINT "status_history_updatedById_fkey";

-- DropIndex
DROP INDEX "addresses_orderId_key";

-- DropIndex
DROP INDEX "addresses_quotationId_key";

-- DropIndex
DROP INDEX "orders_quotationId_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "orderId",
DROP COLUMN "phone",
DROP COLUMN "quotationId",
DROP COLUMN "recipient",
ALTER COLUMN "companyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "description",
DROP COLUMN "icon",
DROP COLUMN "order",
DROP COLUMN "parentId",
DROP COLUMN "productsCount";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "businessHours",
DROP COLUMN "companyType",
DROP COLUMN "totalOrders",
DROP COLUMN "totalProducts",
DROP COLUMN "totalQuotations",
DROP COLUMN "whatsapp";

-- AlterTable
ALTER TABLE "favorite_products" DROP CONSTRAINT "favorite_products_pkey",
DROP COLUMN "addedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "favorite_products_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "favorite_suppliers" DROP CONSTRAINT "favorite_suppliers_pkey",
DROP COLUMN "addedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "favorite_suppliers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "specifications",
DROP COLUMN "totalPrice",
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "buyerCompanyId",
DROP COLUMN "buyerNotes",
DROP COLUMN "cancelledAt",
DROP COLUMN "confirmedAt",
DROP COLUMN "discount",
DROP COLUMN "estimatedDelivery",
DROP COLUMN "hasReview",
DROP COLUMN "internalNotes",
DROP COLUMN "paidAt",
DROP COLUMN "paymentInstallments",
DROP COLUMN "paymentProof",
DROP COLUMN "paymentTransactionId",
DROP COLUMN "quotationId",
DROP COLUMN "shippingCost",
DROP COLUMN "subtotal",
DROP COLUMN "supplierNotes",
DROP COLUMN "tax";

-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "alt";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "compareAtPrice",
DROP COLUMN "deletedAt",
DROP COLUMN "favorites",
DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "minQuantity",
DROP COLUMN "sales",
DROP COLUMN "seoDescription",
DROP COLUMN "seoTitle",
DROP COLUMN "shortDescription",
DROP COLUMN "specifications",
DROP COLUMN "tags",
DROP COLUMN "views",
DROP COLUMN "weight",
DROP COLUMN "width";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "cons",
DROP COLUMN "helpfulCount",
DROP COLUMN "isVerifiedPurchase",
DROP COLUMN "isVisible",
DROP COLUMN "pros",
DROP COLUMN "ratingCustomerService",
DROP COLUMN "ratingDeliveryTime",
DROP COLUMN "ratingProductQuality",
DROP COLUMN "ratingValueForMoney",
DROP COLUMN "supplierRespondedAt",
DROP COLUMN "supplierRespondedById",
DROP COLUMN "supplierResponseComment",
DROP COLUMN "wouldRecommend";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "resetPasswordExpires",
DROP COLUMN "resetPasswordToken";

-- DropTable
DROP TABLE "company_categories";

-- DropTable
DROP TABLE "helpful_reviews";

-- DropTable
DROP TABLE "invoices";

-- DropTable
DROP TABLE "notifications";

-- DropTable
DROP TABLE "quotation_items";

-- DropTable
DROP TABLE "quotations";

-- DropTable
DROP TABLE "shipping_info";

-- DropTable
DROP TABLE "status_history";

-- DropEnum
DROP TYPE "CompanyType";

-- DropEnum
DROP TYPE "PaymentPreference";

-- DropEnum
DROP TYPE "QuotationStatus";

-- CreateTable
CREATE TABLE "quotation_carts" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "quotation_carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotation_cart_items" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "quotation_cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "quotation_carts_userId_key" ON "quotation_carts"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "quotation_cart_items_cartId_productId_key" ON "quotation_cart_items"("cartId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_products_userId_productId_key" ON "favorite_products"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_suppliers_userId_supplierId_key" ON "favorite_suppliers"("userId", "supplierId");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_carts" ADD CONSTRAINT "quotation_carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_cart_items" ADD CONSTRAINT "quotation_cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "quotation_carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotation_cart_items" ADD CONSTRAINT "quotation_cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_products" ADD CONSTRAINT "favorite_products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_products" ADD CONSTRAINT "favorite_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_suppliers" ADD CONSTRAINT "favorite_suppliers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_suppliers" ADD CONSTRAINT "favorite_suppliers_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
