import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { ensureUser } from "../../../lib/ensure-user";

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const user = await ensureUser();
    const body = await request.json();

    const { listingSlug, message } = body;

    if (!listingSlug || !message?.trim()) {
      return NextResponse.json(
        { error: "Listing and message are required." },
        { status: 400 }
      );
    }

    if (!user.email) {
      return NextResponse.json(
        { error: "Your account needs an email address before sending messages." },
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
      WHERE
        l."slug" = ${listingSlug}
        AND l."status" = 'ACTIVE'
      LIMIT 1
    `;

    if (listings.length === 0) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    const listing = listings[0];

    const buyerName =
      user.name?.trim() ||
      user.email ||
      "Harbor Buyer";

    const inquiries = await sql`
      INSERT INTO "Inquiry"
        (
          "id",
          "listingId",
          "sellerId",
          "buyerUserId",
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
          ${user.id},
          ${buyerName},
          ${user.email},
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
    const message =
      error instanceof Error
        ? error.message
        : "The Harbor inquiry could not be created.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: message === "Unauthorized." ? 401 : 500,
      }
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

    const user = await ensureUser();
    const sql = neon(databaseUrl);

    const url = new URL(request.url);

    const inquiryId = url.searchParams.get("id");
    const scope = url.searchParams.get("scope");

    if (inquiryId) {
      const inquiries = await sql`
        SELECT
          i."id",
          i."buyerUserId",
          i."buyerName",
          i."status",
          i."createdAt",
          i."sellerId",
          l."title" AS "listingTitle",
          l."slug" AS "listingSlug",
          s."name" AS "seller",
          s."userId" AS "sellerUserId"
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

      const inquiry = inquiries[0];

      const ownsConversation =
        inquiry.buyerUserId === user.id ||
        inquiry.sellerUserId === user.id;

      if (!ownsConversation) {
        return NextResponse.json(
          { error: "You do not have access to this Harbor conversation." },
          { status: 403 }
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
        inquiry,
        messages,
      });
    }

    if (scope === "seller") {
      const sellers = await sql`
        SELECT "id", "name"
        FROM "Seller"
        WHERE "userId" = ${user.id}
        LIMIT 1
      `;

      if (sellers.length === 0) {
        return NextResponse.json({
          success: true,
          inquiries: [],
        });
      }

      const seller = sellers[0];

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
        WHERE i."sellerId" = ${seller.id}
        ORDER BY i."createdAt" DESC
      `;

      return NextResponse.json({
        success: true,
        inquiries,
      });
    }

    if (scope === "buyer") {
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
            ORDER BY m."createdAt" DESC
            LIMIT 1
          ) AS "lastMessage"
        FROM "Inquiry" i
        JOIN "Listing" l
          ON l."id" = i."listingId"
        JOIN "Seller" s
          ON s."id" = i."sellerId"
        WHERE i."buyerUserId" = ${user.id}
        ORDER BY i."updatedAt" DESC
      `;

      return NextResponse.json({
        success: true,
        inquiries,
      });
    }

    return NextResponse.json(
      { error: "A valid Harbor message scope is required." },
      { status: 400 }
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Harbor inquiries could not be loaded.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: message === "Unauthorized." ? 401 : 500,
      }
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

    const user = await ensureUser();
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
      SELECT
        i."id",
        i."buyerUserId",
        s."userId" AS "sellerUserId"
      FROM "Inquiry" i
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

    const inquiry = inquiries[0];

    let senderType: "BUYER" | "SELLER";

    if (inquiry.buyerUserId === user.id) {
      senderType = "BUYER";
    } else if (inquiry.sellerUserId === user.id) {
      senderType = "SELLER";
    } else {
      return NextResponse.json(
        { error: "You do not have access to this Harbor conversation." },
        { status: 403 }
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
          ${senderType},
          ${message.trim()},
          false,
          NOW()
        )
      RETURNING *
    `;

    await sql`
      UPDATE "Inquiry"
      SET "updatedAt" = NOW()
      WHERE "id" = ${inquiryId}
    `;

    return NextResponse.json({
      success: true,
      message: messages[0],
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Harbor reply could not be sent.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: message === "Unauthorized." ? 401 : 500,
      }
    );
  }
}