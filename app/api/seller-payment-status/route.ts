import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const { searchParams } = new URL(request.url);
const accountId = searchParams.get("accountId");
if (!accountId) {
  return NextResponse.json(
    {
      ok: false,
      error: "accountId is required",
    },
    { status: 400 }
  );
}

    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_SECRET_KEY is missing" },
        { status: 500 }
      );
    }

    const url = new URL(
      `https://api.stripe.com/v2/core/accounts/${accountId}`
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