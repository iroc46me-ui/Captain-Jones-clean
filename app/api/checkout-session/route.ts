import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "STRIPE_SECRET_KEY is missing",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        {
          ok: false,
          error: "session_id is required",
        },
        { status: 400 }
      );
    }

    const stripe = new Stripe(secretKey);

    const session = await stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ["payment_intent"],
      }
    );

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        {
          ok: false,
          error: "Payment has not been completed.",
        },
        { status: 400 }
      );
    }

    const metadata = session.metadata || {};

    return NextResponse.json({
      ok: true,

      order: {
        title: metadata.listingSlug
          ? metadata.listingSlug
              .split("-")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() +
                  word.slice(1)
              )
              .join(" ")
          : "Treasure",

        slug: metadata.listingSlug || "",

        price:
          typeof session.amount_total === "number"
            ? `$${(session.amount_total / 100).toFixed(2)}`
            : "",

        seller: metadata.sellerName || "Harbor Seller",

        orderId: session.id,

        status: "Payment Confirmed",

        orderedAt: new Date(
          session.created * 1000
        ).toISOString(),

        feePercent: metadata.feePercent || "",

        harborFeeInCents:
          metadata.harborFeeInCents || "",

        sellerAmountInCents:
          metadata.sellerAmountInCents || "",

        transferGroup:
          metadata.transferGroup || "",
      },
    });
  } catch (error) {
    console.error("Checkout session lookup error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to retrieve checkout session.",
      },
      { status: 500 }
    );
  }
}