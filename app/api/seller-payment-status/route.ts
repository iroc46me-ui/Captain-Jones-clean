import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { getSellerById } from "../../../lib/sellers";

export async function GET(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const databaseUrl = process.env.DATABASE_URL;

    const { searchParams } = new URL(request.url);
    const sellerId = searchParams.get("sellerId");

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

    if (!databaseUrl) {
      return NextResponse.json(
        { ok: false, error: "DATABASE_URL is missing" },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);

    const rows = await sql`
      SELECT "stripeAccountId"
      FROM "Seller"
      WHERE "id" = ${sellerId}
      LIMIT 1
    `;

    const stripeAccountId =
      rows.length > 0 ? rows[0].stripeAccountId : null;

    if (!stripeAccountId) {
      return NextResponse.json({
        ok: true,
        sellerId,
        sellerName: sellerInfo.name,
        connected: false,
        readyForPayouts: false,
        transferStatus: null,
        hasCurrentRequirements: false,
      });
    }

    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_SECRET_KEY is missing" },
        { status: 500 }
      );
    }

    const url = new URL(
      `https://api.stripe.com/v2/core/accounts/${stripeAccountId}`
    );

    url.searchParams.append("include[0]", "requirements");
    url.searchParams.append(
      "include[1]",
      "configuration.recipient"
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Stripe-Version": "2026-02-25.preview",
      },
    });

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

    const transferStatus =
      data.configuration?.recipient?.capabilities?.stripe_balance
        ?.stripe_transfers?.status ?? null;

    const hasCurrentRequirements =
      Array.isArray(data.requirements?.entries) &&
      data.requirements.entries.length > 0;

    const readyForPayouts =
      transferStatus === "active" && !hasCurrentRequirements;

    return NextResponse.json({
      ok: true,
      sellerId,
      sellerName: sellerInfo.name,
      connected: true,
      accountId: data.id,
      readyForPayouts,
      transferStatus,
      hasCurrentRequirements,
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