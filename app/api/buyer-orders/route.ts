
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          error: "You must be signed in to view your orders.",
        },
        { status: 401 }
      );
    }

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Order history is temporarily unavailable.",
        },
        { status: 503 }
      );
    }

    const sql = neon(databaseUrl);

    const buyerRows = await sql`
      SELECT "id"
      FROM "User"
      WHERE "clerkUserId" = ${clerkUserId}
      LIMIT 1
    `;

    if (buyerRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Marketplace account was not found.",
        },
        { status: 404 }
      );
    }

    const buyerUserId = String(buyerRows[0].id);

    const orders = await sql`
      SELECT
        o."id",
        o."amountCents",
        o."paymentStatus",
        o."shippingStatus",
        o."shippingCarrier",
        o."trackingNumber",
        o."shippedAt",
        o."deliveredAt",
        o."inspectionEndsAt",
        o."buyerReportedProblemAt",
        o."createdAt",
        l."slug" AS "listingSlug",
        l."title" AS "listingTitle",
        s."name" AS "sellerName"
      FROM "Order" o
      INNER JOIN "Listing" l
        ON l."id" = o."listingId"
      INNER JOIN "Seller" s
        ON s."id" = o."sellerId"
      WHERE o."buyerUserId" = ${buyerUserId}
      ORDER BY o."createdAt" DESC
    `;

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Buyer orders API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to retrieve your orders.",
      },
      { status: 500 }
    );
  }
}
