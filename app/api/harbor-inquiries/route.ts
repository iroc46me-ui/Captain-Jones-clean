import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      listingSlug,
      buyerName,
      buyerEmail,
      message,
    } = body;

    if (
      !listingSlug ||
      !buyerName ||
      !buyerEmail ||
      !message
    ) {
      return NextResponse.json(
        { error: "Required inquiry information is missing." },
        { status: 400 }
      );
    }

    const sql = neon(databaseUrl);

    const listings = await sql`
      SELECT
        l."id",
        l."sellerId",
        l."title",
        l."slug"
      FROM "Listing" l
      WHERE l."slug" = ${listingSlug}
      LIMIT 1
    `;

    if (listings.length === 0) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    const listing = listings[0];

    const inquiries = await sql`
      INSERT INTO "Inquiry"
        (
          "id",
          "listingId",
          "sellerId",
          "buyerName",
          "buyerEmail",
          "status",
          "createdAt",
          "updatedAt"
        )
      VALUES
        (
          gen_random_uuid()::text,
          ${listing.id},
          ${listing.sellerId},
          ${buyerName.trim()},
          ${buyerEmail.trim()},
          'OPEN',
          NOW(),
          NOW()
        )
      RETURNING *
    `;

    const inquiry = inquiries[0];

    const messages = await sql`
      INSERT INTO "InquiryMessage"
        (
          "id",
          "inquiryId",
          "senderType",
          "body",
          "flagged",
          "createdAt"
        )
      VALUES
        (
          gen_random_uuid()::text,
          ${inquiry.id},
          'BUYER',
          ${message.trim()},
          false,
          NOW()
        )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        inquiry,
        message: messages[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unable to create Harbor inquiry:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The Harbor inquiry could not be created.",
      },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const inquiryId = url.searchParams.get("id");
    const sellerName = url.searchParams.get("seller");

    const sql = neon(databaseUrl);

    if (inquiryId) {
      const inquiries = await sql`
        SELECT
          i."id",
          i."buyerName",
          i."status",
          i."createdAt",
          l."title" AS "listingTitle",
          l."slug" AS "listingSlug",
          s."name" AS "seller"
        FROM "Inquiry" i
        JOIN "Listing" l
          ON l."id" = i."listingId"
        JOIN "Seller" s
          ON s."id" = i."sellerId"
        WHERE i."id" = ${inquiryId}
        LIMIT 1
      `;

      if (inquiries.length === 0) {
        return NextResponse.json(
          { error: "Harbor conversation not found." },
          { status: 404 }
        );
      }

      const messages = await sql`
        SELECT
          "id",
          "senderType",
          "body",
          "flagged",
          "createdAt"
        FROM "InquiryMessage"
        WHERE "inquiryId" = ${inquiryId}
        ORDER BY "createdAt" ASC
      `;

      return NextResponse.json({
        success: true,
        inquiry: inquiries[0],
        messages,
      });
    }

    if (!sellerName) {
      return NextResponse.json(
        { error: "Seller name is required." },
        { status: 400 }
      );
    }

    const inquiries = await sql`
      SELECT
        i."id",
        i."buyerName",
        i."status",
        i."createdAt",
        l."title" AS "listingTitle",
        l."slug" AS "listingSlug",
        s."name" AS "seller",
        (
          SELECT m."body"
          FROM "InquiryMessage" m
          WHERE m."inquiryId" = i."id"
          ORDER BY m."createdAt" ASC
          LIMIT 1
        ) AS "firstMessage"
      FROM "Inquiry" i
      JOIN "Listing" l
        ON l."id" = i."listingId"
      JOIN "Seller" s
        ON s."id" = i."sellerId"
      WHERE s."name" = ${sellerName}
      ORDER BY i."createdAt" DESC
    `;

    return NextResponse.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error("Unable to load Harbor inquiries:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Harbor inquiries could not be loaded.",
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
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { inquiryId, message } = body;

    if (!inquiryId || !message?.trim()) {
      return NextResponse.json(
        { error: "Inquiry ID and reply message are required." },
        { status: 400 }
      );
    }

    const sql = neon(databaseUrl);

    const inquiries = await sql`
      SELECT "id"
      FROM "Inquiry"
      WHERE "id" = ${inquiryId}
      LIMIT 1
    `;

    if (inquiries.length === 0) {
      return NextResponse.json(
        { error: "Harbor conversation not found." },
        { status: 404 }
      );
    }

    const messages = await sql`
      INSERT INTO "InquiryMessage"
        (
          "id",
          "inquiryId",
          "senderType",
          "body",
          "flagged",
          "createdAt"
        )
      VALUES
        (
          gen_random_uuid()::text,
          ${inquiryId},
          'SELLER',
          ${message.trim()},
          false,
          NOW()
        )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      message: messages[0],
    });
  } catch (error) {
    console.error("Unable to send Harbor reply:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Harbor reply could not be sent.",
      },
      { status: 500 }
    );
  }
}