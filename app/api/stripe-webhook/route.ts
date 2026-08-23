import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey) {
    return NextResponse.json(
      { ok: false, error: "STRIPE_SECRET_KEY is missing" },
      { status: 500 }
    );
  }

  if (!webhookSecret) {
    return NextResponse.json(
      { ok: false, error: "STRIPE_WEBHOOK_SECRET is missing" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { ok: false, error: "Stripe signature is missing" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);

    return NextResponse.json(
      { ok: false, error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const metadata = session.metadata || {};

      const sellerStripeAccountId =
        metadata.sellerStripeAccountId;

      const sellerAmountInCents = Number(
        metadata.sellerAmountInCents
      );

      const transferGroup = metadata.transferGroup;

      if (
        !sellerStripeAccountId ||
        !sellerAmountInCents ||
        !transferGroup
      ) {
        console.error(
          "Missing seller transfer metadata:",
          metadata
        );

        return NextResponse.json(
          {
            ok: false,
            error: "Seller transfer metadata is incomplete",
          },
          { status: 400 }
        );
      }

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id;

      if (!paymentIntentId) {
        return NextResponse.json(
          {
            ok: false,
            error: "PaymentIntent ID is missing",
          },
          { status: 400 }
        );
      }

      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      const chargeId =
        typeof paymentIntent.latest_charge === "string"
          ? paymentIntent.latest_charge
          : paymentIntent.latest_charge?.id;

      if (!chargeId) {
        return NextResponse.json(
          {
            ok: false,
            error: "Charge ID is missing",
          },
          { status: 400 }
        );
      }

      const existingTransfers = await stripe.transfers.list({
        transfer_group: transferGroup,
        limit: 10,
      });

      if (existingTransfers.data.length === 0) {
        const transfer = await stripe.transfers.create({
          amount: sellerAmountInCents,
          currency: "usd",
          destination: sellerStripeAccountId,
          transfer_group: transferGroup,
          source_transaction: chargeId,

          metadata: {
            listingSlug: metadata.listingSlug || "",
            sellerId: metadata.sellerId || "",
            sellerName: metadata.sellerName || "",
            feePercent: metadata.feePercent || "",
          },
        });

        console.log(
          "Seller transfer created:",
          transfer.id
        );
      } else {
        console.log(
          "Seller transfer already exists for:",
          transferGroup
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}