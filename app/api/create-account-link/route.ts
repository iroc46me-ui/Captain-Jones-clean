import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    // SECURITY: Require authentication.
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { ok: false, error: "You must be signed in." },
        { status: 401 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const databaseUrl = process.env.DATABASE_URL;

    if (!secretKey || !databaseUrl) {
      return NextResponse.json(
        { ok: false, error: "Server configuration is missing." },
        { status: 500 }
      );
    }

    // An accountId is optional for the onboarding refresh page.
    const body = await request.json();
    const requestedAccountId = body?.accountId;

    if (
      requestedAccountId !== undefined &&
      (typeof requestedAccountId !== "string" ||
        !requestedAccountId.trim())
    ) {
      return NextResponse.json(
        { ok: false, error: "Invalid accountId." },
        { status: 400 }
      );
    }

    const sql = neon(databaseUrl);

    // Find the Stripe account owned by the signed-in seller.
    const sellerRows = await sql`
      SELECT s."stripeAccountId"
      FROM "Seller" s
      INNER JOIN "User" u
        ON u."id" = s."userId"
      WHERE u."clerkUserId" = ${clerkUserId}
      LIMIT 1
    `;

    if (
      sellerRows.length === 0 ||
      !sellerRows[0].stripeAccountId
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "No connected Stripe account found for this seller.",
        },
        { status: 404 }
      );
    }

    const ownedAccountId = String(sellerRows[0].stripeAccountId);

    // SECURITY: Never generate a link for another seller's account.
    if (
      requestedAccountId &&
      requestedAccountId !== ownedAccountId
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "You do not own this Stripe account.",
        },
        { status: 403 }
      );
    }

    const response = await fetch(
      "https://api.stripe.com/v2/core/account_links",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          "Stripe-Version": "2026-02-25.preview",
        },
        body: JSON.stringify({
          account: ownedAccountId,
          use_case: {
            type: "account_onboarding",
            account_onboarding: {
              configurations: ["recipient"],
              refresh_url:
                "https://www.daveyjonesjunkntreasure.com/stripe-onboarding/refresh",
              return_url:
                "https://www.daveyjonesjunkntreasure.com/stripe-onboarding/return",
              collection_options: {
                fields: "eventually_due",
                future_requirements: "include",
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

    return NextResponse.json({
      ok: true,
      url: data.url,
      expiresAt: data.expires_at,
      accountId: data.account,
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