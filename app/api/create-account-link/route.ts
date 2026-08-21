import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_SECRET_KEY is missing" },
        { status: 500 }
      );
    }

    const { accountId } = await request.json();

    if (!accountId) {
      return NextResponse.json(
        { ok: false, error: "accountId is required" },
        { status: 400 }
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
          account: accountId,
          use_case: {
            type: "account_onboarding",
            account_onboarding: {
              configurations: ["recipient"],
              refresh_url:
                "http://localhost:3000/stripe-onboarding/refresh",
              return_url:
                "http://localhost:3000/stripe-onboarding/return",
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
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}