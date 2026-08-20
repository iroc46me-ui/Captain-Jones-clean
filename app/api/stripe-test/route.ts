import Stripe from "stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { ok: false, error: "STRIPE_SECRET_KEY is missing" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const balance = await stripe.balance.retrieve();

    return NextResponse.json({
      ok: true,
      stripeConnected: true,
      livemode: balance.livemode,
    });
  } catch (error) {
    console.error("Stripe test error:", error);

    return NextResponse.json(
      {
        ok: false,
        stripeConnected: false,
        error: error instanceof Error ? error.message : "Unknown Stripe error",
      },
      { status: 500 }
    );
  }
}