/*
  Warnings:

  - A unique constraint covering the columns `[stripeTransferId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "buyerReportedProblemAt" TIMESTAMP(3),
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "inspectionEndsAt" TIMESTAMP(3),
ADD COLUMN     "sellerTransferStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "sellerTransferredAt" TIMESTAMP(3),
ADD COLUMN     "stripeTransferId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeTransferId_key" ON "Order"("stripeTransferId");
