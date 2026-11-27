ALTER TABLE "Seller"
ADD COLUMN "foundingCrewJoinedAt" TIMESTAMP(3),
ADD COLUMN "foundingFeeStartsAt" TIMESTAMP(3),
ADD COLUMN "foundingFeeEndsAt" TIMESTAMP(3);

CREATE TABLE "HarborProgram" (
    "id" TEXT NOT NULL,
    "launchAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HarborProgram_pkey" PRIMARY KEY ("id")
);

INSERT INTO "HarborProgram" ("id")
VALUES ('founding-crew');
