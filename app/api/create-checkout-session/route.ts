import { NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

const checkoutListings = {
  "vintage-brass-ship-lantern": {
    title: "Vintage Brass Ship Lantern",
    priceInCents: 6800,
    sellerId: "old-harbor-finds",
    sellerName: "Old Harbor Finds",
    feePercent: 3,
  },

  "desert-nugget-digger": {
    title: "Desert Nugget Digger",
    priceInCents: 7500,
    sellerId: "daveys-workshop",
    sellerName: "Davey's Workshop",
    feePercent: 5,
  },
} as const;

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

    const { slug } = await request.json();

    if (!slug || !(slug in checkoutListings)) {
      return NextResponse.json(
        { ok: false, error: "Listing not available for Stripe checkout." },
        { status: 400 }
      );
    }

    const listing =
      checkoutListings[slug as keyof typeof checkoutListings];

    const sql = neon(databaseUrl);

    const sellerRows = await sql`
      SELECT "stripeAccountId"
      FROM "Seller"
      WHERE "id" = ${listing.sellerId}
      LIMIT 1
    `;

    const sellerStripeAccountId =
      sellerRows[0]?.stripeAccountId as string | undefined;

    if (!sellerStripeAccountId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Seller is not connected to Stripe.",
        },
        { status: 400 }
      );
    }

    const stripe = new Stripe(secretKey);

    const harborFeeInCents = Math.round(
      listing.priceInCents * (listing.feePercent / 100)
    );

    const sellerAmountInCents =
      listing.priceInCents - harborFeeInCents;

    const transferGroup = `DJ-${Date.now()}`;

    const origin =
      request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: listing.title,
              description: `Sold by ${listing.sellerName}`,
            },
            unit_amount: listing.priceInCents,
          },
          quantity: 1,
        },
      ],

      payment_intent_data: {
        transfer_group: transferGroup,

        metadata: {
          listingSlug: slug,
          sellerId: listing.sellerId,
          sellerName: listing.sellerName,
          sellerStripeAccountId,
          feePercent: String(listing.feePercent),
          harborFeeInCents: String(harborFeeInCents),
          sellerAmountInCents: String(sellerAmountInCents),
          transferGroup,
        },
      },

      metadata: {
        listingSlug: slug,
        sellerId: listing.sellerId,
        sellerName: listing.sellerName,
        sellerStripeAccountId,
        feePercent: String(listing.feePercent),
        harborFeeInCents: String(harborFeeInCents),
        sellerAmountInCents: String(sellerAmountInCents),
        transferGroup,
      },

      success_url:
        `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${origin}/checkout?item=${encodeURIComponent(slug)}`,
    });

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe checkout session error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to create Stripe checkout session.",
      },
      { status: 500 }
    );
  }
}