import { NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const databaseUrl = process.env.DATABASE_URL;

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

  if (!databaseUrl) {
    return NextResponse.json(
      { ok: false, error: "DATABASE_URL is missing" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secretKey);
  const sql = neon(databaseUrl);

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
    console.error(
      "Webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      { ok: false, error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session =
        event.data.object as Stripe.Checkout.Session;

      if (session.payment_status !== "paid") {
        return NextResponse.json({ received: true });
      }

      const metadata = session.metadata || {};

      const listingId = metadata.listingId;
      const listingSlug = metadata.listingSlug;
      const buyerUserId = metadata.buyerUserId;
      const sellerId = metadata.sellerId;

      const harborFeeInCents = Number(
        metadata.harborFeeInCents
      );

      const sellerAmountInCents = Number(
        metadata.sellerAmountInCents
      );

      if (
        !listingId ||
        !listingSlug ||
        !buyerUserId ||
        !sellerId
      ) {
        console.error(
          "Marketplace order metadata is incomplete:",
          metadata
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "Marketplace order metadata is incomplete",
          },
          { status: 400 }
        );
      }

      if (
        !Number.isInteger(harborFeeInCents) ||
        harborFeeInCents < 0 ||
        !Number.isInteger(sellerAmountInCents) ||
        sellerAmountInCents < 0
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Marketplace payment amounts are invalid.",
          },
          { status: 400 }
        );
      }

      const listingRows = await sql`
        SELECT
          "id",
          "priceCents",
          "status"
        FROM "Listing"
        WHERE "id" = ${listingId}
        LIMIT 1
      `;

      if (listingRows.length === 0) {
        return NextResponse.json(
          {
            ok: false,
            error: "Purchased listing was not found.",
          },
          { status: 404 }
        );
      }

      const listing = listingRows[0];
      const priceCents = Number(listing.priceCents);

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null;

      const existingOrders = await sql`
        SELECT "id"
        FROM "Order"
        WHERE "stripeCheckoutSessionId" = ${session.id}
        LIMIT 1
      `;

      if (existingOrders.length > 0) {
        console.log(
          "Order already recorded for Stripe session:",
          session.id
        );

        return NextResponse.json({ received: true });
      }

      if (listing.status !== "ACTIVE") {
        console.error(
          "Paid listing is no longer ACTIVE:",
          listingId,
          listing.status
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "Paid listing is no longer available.",
          },
          { status: 409 }
        );
      }

      await sql`
        INSERT INTO "Order" (
          "id",
          "listingId",
          "sellerId",
          "buyerUserId",
          "stripeCheckoutSessionId",
          "stripePaymentIntentId",
          "amountCents",
          "harborFeeInCents",
          "sellerAmountCents",
          "paymentStatus",
          "shippingStatus",
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${crypto.randomUUID()},
          ${listingId},
          ${sellerId},
          ${buyerUserId},
          ${session.id},
          ${paymentIntentId},
          ${priceCents},
          ${harborFeeInCents},
          ${sellerAmountInCents},
          'PAID',
          'AWAITING_SHIPMENT',
          NOW(),
          NOW()
        )
      `;

      await sql`
        UPDATE "Listing"
        SET
          "status" = 'SOLD',
          "updatedAt" = NOW()
        WHERE "id" = ${listingId}
      `;

      console.log(
        "Marketplace order recorded:",
        session.id,
        listingSlug
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

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