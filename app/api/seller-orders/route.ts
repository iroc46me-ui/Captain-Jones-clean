import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

async function getCurrentSellerId(databaseUrl: string) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          success: false,
          error: "You must be signed in.",
        },
        { status: 401 }
      ),
    };
  }

  const sql = neon(databaseUrl);

  const sellerRows = await sql`
    SELECT
      s."id",
      s."name"
    FROM "Seller" s
    INNER JOIN "User" u
      ON u."id" = s."userId"
    WHERE u."clerkUserId" = ${clerkUserId}
    LIMIT 1
  `;

  if (sellerRows.length === 0) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          success: false,
          error: "Seller account was not found.",
        },
        { status: 404 }
      ),
    };
  }

  return {
    ok: true as const,
    sellerId: String(sellerRows[0].id),
  };
}

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL is missing.",
        },
        { status: 500 }
      );
    }

    const sellerResult = await getCurrentSellerId(databaseUrl);

    if (!sellerResult.ok) {
      return sellerResult.response;
    }

    const sql = neon(databaseUrl);

    const orders = await sql`
      SELECT
        o."id",
        o."amountCents",
        o."harborFeeInCents",
        o."sellerAmountCents",
        o."paymentStatus",
        o."shippingStatus",
        o."shippingCarrier",
        o."trackingNumber",
        o."shippedAt",
        o."createdAt",
        l."id" AS "listingId",
        l."slug" AS "listingSlug",
        l."title" AS "listingTitle"
      FROM "Order" o
      INNER JOIN "Listing" l
        ON l."id" = o."listingId"
      WHERE o."sellerId" = ${sellerResult.sellerId}
      ORDER BY o."createdAt" DESC
    `;

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Seller orders API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Seller orders could not be loaded.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL is missing.",
        },
        { status: 500 }
      );
    }

    const sellerResult = await getCurrentSellerId(databaseUrl);

    if (!sellerResult.ok) {
      return sellerResult.response;
    }

    const body = await request.json();

    const orderId =
      typeof body.orderId === "string"
        ? body.orderId.trim()
        : "";

    const shippingCarrier =
      typeof body.shippingCarrier === "string"
        ? body.shippingCarrier.trim()
        : "";

    const trackingNumber =
      typeof body.trackingNumber === "string"
        ? body.trackingNumber.trim()
        : "";

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID is required.",
        },
        { status: 400 }
      );
    }

    if (!shippingCarrier) {
      return NextResponse.json(
        {
          success: false,
          error: "Shipping carrier is required.",
        },
        { status: 400 }
      );
    }

    if (!trackingNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Tracking number is required.",
        },
        { status: 400 }
      );
    }

    const sql = neon(databaseUrl);

    const orderRows = await sql`
      SELECT
        "id",
        "sellerId",
        "shippingStatus"
      FROM "Order"
      WHERE "id" = ${orderId}
      LIMIT 1
    `;

    if (orderRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order was not found.",
        },
        { status: 404 }
      );
    }

    const order = orderRows[0];

    if (String(order.sellerId) !== sellerResult.sellerId) {
      return NextResponse.json(
        {
          success: false,
          error: "You do not own this order.",
        },
        { status: 403 }
      );
    }

    if (String(order.shippingStatus) === "SHIPPED") {
      return NextResponse.json(
        {
          success: false,
          error: "This order has already been marked shipped.",
        },
        { status: 400 }
      );
    }

    const updatedRows = await sql`
      UPDATE "Order"
      SET
        "shippingCarrier" = ${shippingCarrier},
        "trackingNumber" = ${trackingNumber},
        "shippingStatus" = 'SHIPPED',
        "shippedAt" = NOW(),
        "updatedAt" = NOW()
      WHERE "id" = ${orderId}
        AND "sellerId" = ${sellerResult.sellerId}
      RETURNING
        "id",
        "amountCents",
        "harborFeeInCents",
        "sellerAmountCents",
        "paymentStatus",
        "shippingStatus",
        "shippingCarrier",
        "trackingNumber",
        "shippedAt",
        "createdAt"
    `;

    if (updatedRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order could not be updated.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedRows[0],
    });
  } catch (error) {
    console.error(
      "Seller order update API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Order could not be updated.",
      },
      { status: 500 }
    );
  }
}