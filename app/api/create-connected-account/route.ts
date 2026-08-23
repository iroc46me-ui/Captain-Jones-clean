import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSellerById } from "../../../lib/sellers";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const databaseUrl = process.env.DATABASE_URL;

    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_SECRET_KEY is missing" },
        { status: 500 }
      );
    }

    if (!databaseUrl) {
      return NextResponse.json(
        { ok: false, error: "DATABASE_URL is missing" },
        { status: 500 }
      );
    }

    const { sellerId } = await request.json();

    if (!sellerId) {
      return NextResponse.json(
        { ok: false, error: "sellerId is required" },
        { status: 400 }
      );
    }

    const sellerInfo = getSellerById(sellerId);

    if (!sellerInfo) {
      return NextResponse.json(
        { ok: false, error: "Seller not found" },
        { status: 404 }
      );
    }

    const sql = neon(databaseUrl);

    const existing = await sql`
      SELECT "stripeAccountId"
      FROM "Seller"
      WHERE "id" = ${sellerId}
      LIMIT 1
    `;

    if (existing.length > 0 && existing[0].stripeAccountId) {
      return NextResponse.json({
        ok: true,
        accountId: existing[0].stripeAccountId,
        existing: true,
      });
    }

    const response = await fetch(
      "https://api.stripe.com/v2/core/accounts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          "Stripe-Version": "2026-02-25.preview",
        },
        body: JSON.stringify({
          display_name: sellerInfo.name,
          contact_email: "testaccount@example.com",

          defaults: {
            responsibilities: {
              fees_collector: "application",
              losses_collector: "application",
            },
          },

          dashboard: "express",

          identity: {
            country: "us",
            entity_type: "individual",
          },

          configuration: {
            recipient: {
              capabilities: {
                stripe_balance: {
                  stripe_transfers: {
                    requested: true,
                  },
                },
              },
            },
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          ok: false,
          stripeStatus: response.status,
          error: data,
        },
        { status: response.status }
      );
    }

    await sql`
      INSERT INTO "Seller"
        ("id", "name", "stripeAccountId", "createdAt", "updatedAt")
      VALUES
        (${sellerId}, ${sellerInfo.name}, ${data.id}, NOW(), NOW())
      ON CONFLICT ("id")
      DO UPDATE SET
        "name" = EXCLUDED."name",
        "stripeAccountId" = EXCLUDED."stripeAccountId",
        "updatedAt" = NOW()
    `;

    return NextResponse.json({
      ok: true,
      accountId: data.id,
      existing: false,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}