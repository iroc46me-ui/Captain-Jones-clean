
-- Guest checkout foundation
-- Preserve existing orders and registered buyers.

ALTER TABLE "Listing"
ADD COLUMN "guestCheckoutTokenHash" TEXT;

ALTER TABLE "Order"
ADD COLUMN "buyerEmail" TEXT,
ADD COLUMN "buyerName" TEXT,
ALTER COLUMN "buyerUserId" DROP NOT NULL;

ALTER TABLE "Order"
DROP CONSTRAINT "Order_buyerUserId_fkey";

ALTER TABLE "Order"
ADD CONSTRAINT "Order_buyerUserId_fkey"
FOREIGN KEY ("buyerUserId")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
