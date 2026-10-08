import { NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { randomUUID } from "node:crypto";

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
    if (event.type === "checkout.session.expired") {
      const expired = event.data.object as Stripe.Checkout.Session;
      const reservationId = expired.metadata?.reservationId;
      if (reservationId) {
        await sql`
          UPDATE "Listing" SET "reservedByUserId" = NULL, "reservedUntil" = NULL,
          "reservationId" = NULL, "stripeCheckoutSessionId" = NULL, "updatedAt" = NOW()
          WHERE "reservationId" = ${reservationId} AND "stripeCheckoutSessionId" = ${expired.id}
          AND "status" = 'ACTIVE'
        `;
      }
      return NextResponse.json({ received: true });
    }

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
      const reservationId = metadata.reservationId;

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
        !sellerId ||
        !reservationId
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

      // Stripe may retry this webhook.
      // If this Checkout Session already produced an order,
      // acknowledge it without creating another one.
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

      const listingRows = await sql`
        SELECT
          "id",
          "slug",
          "priceCents",
          "status",
          "sellerId",
          "reservedByUserId",
          "reservationId"
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

      if (
        listing.slug !== listingSlug ||
        listing.sellerId !== sellerId
      ) {
        console.error(
          "Stripe metadata does not match listing:",
          listingId
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "Marketplace listing metadata does not match.",
          },
          { status: 409 }
        );
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

      if (
        listing.reservationId !== reservationId ||
        listing.reservedByUserId !== buyerUserId
      ) {
        console.error(
          "Paid checkout does not own the listing reservation:",
          listingId,
          session.id
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "Checkout reservation does not match.",
          },
          { status: 409 }
        );
      }

      if (
        !Number.isInteger(priceCents) ||
        priceCents <= 0
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: "Listing price is invalid.",
          },
          { status: 400 }
        );
      }

      if (
        harborFeeInCents + sellerAmountInCents !==
        priceCents
      ) {
        console.error(
          "Marketplace payment split does not match listing price:",
          listingId
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "Marketplace payment amounts do not match listing price.",
          },
          { status: 409 }
        );
      }

      if (
        session.amount_total !== null &&
        session.amount_total !== priceCents
      ) {
        console.error(
          "Stripe amount does not match listing price:",
          listingId,
          session.amount_total,
          priceCents
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "Stripe payment amount does not match listing price.",
          },
          { status: 409 }
        );
      }

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id || null;

      /*
       * Finalize only the listing that still owns this exact
       * reservation. We deliberately do NOT reject merely because
       * reservedUntil has passed: Stripe may legitimately deliver
       * the successful webhook slightly after the hold time.
       */
            const finalizedRows = await sql`
        WITH claimed_listing AS (
          UPDATE "Listing"
          SET
            "status" = 'SOLD',
            "reservedByUserId" = NULL,
            "reservedUntil" = NULL,
            "reservationId" = NULL,
            "stripeCheckoutSessionId" = NULL,
            "updatedAt" = NOW()
          WHERE
            "id" = ${listingId}
            AND "status" = 'ACTIVE'
            AND "sellerId" = ${sellerId}
            AND "reservedByUserId" = ${buyerUserId}
            AND "reservationId" = ${reservationId}
          RETURNING
            "id",
            "priceCents"
        ),
        created_order AS (
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
          SELECT
            ${randomUUID()},
            "id",
            ${sellerId},
            ${buyerUserId},
            ${session.id},
            ${paymentIntentId},
            "priceCents",
            ${harborFeeInCents},
            ${sellerAmountInCents},
            'PAID',
            'AWAITING_SHIPMENT',
            NOW(),
            NOW()
          FROM claimed_listing
          RETURNING "id"
        )
        SELECT "id"
        FROM created_order
      `;

      if (finalizedRows.length === 0) {
        console.error(
          "Reservation changed before sale could finalize:",
          listingId,
          session.id
        );

        return NextResponse.json(
          {
            ok: false,
            error:
              "The treasure reservation changed before payment could be finalized.",
          },
          { status: 409 }
        );
      }
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