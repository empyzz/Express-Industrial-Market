/*
  Warnings:

  - You are about to drop the `abuse_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cancellations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotation_attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotation_suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review_images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "abuse_reports" DROP CONSTRAINT "abuse_reports_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "abuse_reports" DROP CONSTRAINT "abuse_reports_userId_fkey";

-- DropForeignKey
ALTER TABLE "cancellations" DROP CONSTRAINT "cancellations_orderId_fkey";

-- DropForeignKey
ALTER TABLE "cancellations" DROP CONSTRAINT "cancellations_requestedById_fkey";

-- DropForeignKey
ALTER TABLE "company_documents" DROP CONSTRAINT "company_documents_companyId_fkey";

-- DropForeignKey
ALTER TABLE "order_documents" DROP CONSTRAINT "order_documents_orderId_fkey";

-- DropForeignKey
ALTER TABLE "product_documents" DROP CONSTRAINT "product_documents_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_productId_fkey";

-- DropForeignKey
ALTER TABLE "quotation_attachments" DROP CONSTRAINT "quotation_attachments_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "quotation_suppliers" DROP CONSTRAINT "quotation_suppliers_quotationId_fkey";

-- DropForeignKey
ALTER TABLE "quotation_suppliers" DROP CONSTRAINT "quotation_suppliers_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "quotations" DROP CONSTRAINT "quotations_buyerCompanyId_fkey";

-- DropForeignKey
ALTER TABLE "review_images" DROP CONSTRAINT "review_images_reviewId_fkey";

-- DropTable
DROP TABLE "abuse_reports";

-- DropTable
DROP TABLE "cancellations";

-- DropTable
DROP TABLE "company_documents";

-- DropTable
DROP TABLE "order_documents";

-- DropTable
DROP TABLE "product_documents";

-- DropTable
DROP TABLE "quotation_attachments";

-- DropTable
DROP TABLE "quotation_suppliers";

-- DropTable
DROP TABLE "review_images";

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
