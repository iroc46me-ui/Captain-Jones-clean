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