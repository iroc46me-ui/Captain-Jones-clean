import { NextResponse } from "next/server";

export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_SECRET_KEY is missing" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.stripe.com/v2/core/accounts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        "Stripe-Version": "2026-02-25.preview",
      },
      body: JSON.stringify({
        display_name: "Davey Jones Test Seller",
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

    return NextResponse.json({
      ok: true,
      accountId: data.id,
      account: data,
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