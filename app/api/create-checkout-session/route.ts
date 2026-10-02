import { NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from "node:crypto";

const DEFAULT_HARBOR_FEE_PERCENT = 5;
const RESERVATION_MINUTES = 35;

export async function POST(request: Request) {
  let reservationContext: {
    databaseUrl: string;
    listingId: string;
    reservationId: string;
  } | null = null;

  try {
    // PUBLIC PREVIEW SAFETY LOCK
    // Remove only when live marketplace payments are ready.
    if (process.env.ENABLE_MARKETPLACE_PAYMENTS !== "true") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "The Harbor is currently open for preview. " +
            "Purchases will become available soon.",
          code: "HARBOR_PREVIEW_MODE",
        },
        { status: 503 }
      );
    }

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const databaseUrl = process.env.DATABASE_URL;

    if (!secretKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "STRIPE_SECRET_KEY is missing.",
        },
        { status: 500 }
      );
    }

    if (!databaseUrl) {
      return NextResponse.json(
        {
          ok: false,
          error: "DATABASE_URL is missing.",
        },
        { status: 500 }
      );
    }

    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        {
          ok: false,
          error: "You must be signed in to purchase a treasure.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const slug =
      typeof body.slug === "string"
        ? body.slug.trim()
        : "";

    if (!slug) {
      return NextResponse.json(
        {
          ok: false,
          error: "Listing slug is required.",
        },
        { status: 400 }
      );
    }

    const sql = neon(databaseUrl);

    const buyerRows = await sql`
      SELECT
        "id",
        "email",
        "name"
      FROM "User"
      WHERE "clerkUserId" = ${clerkUserId}
      LIMIT 1
    `;

    if (buyerRows.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Your marketplace account could not be found.",
        },
        { status: 404 }
      );
    }

    const buyer = buyerRows[0];
    const buyerUserId = String(buyer.id);

    const reservationId = randomUUID();

    // Atomically reserve the treasure.
    // Only one request can successfully claim an available listing.
    const reservationRows = await sql`
      UPDATE "Listing"
      SET
        "reservedByUserId" = ${buyerUserId},
        "reservedUntil" =
          NOW() + (${RESERVATION_MINUTES} * INTERVAL '1 minute'),
        "reservationId" = ${reservationId},
        "updatedAt" = NOW()
      WHERE
        "slug" = ${slug}
        AND "status" = 'ACTIVE'
        AND (
          "reservedUntil" IS NULL
          OR "reservedUntil" <= NOW()
        )
      RETURNING
        "id",
        "slug",
        "title",
        "priceCents",
        "status",
        "sellerId"
    `;

    if (reservationRows.length === 0) {
      const listingRows = await sql`
        SELECT
          "id",
          "status",
          "reservedUntil"
        FROM "Listing"
        WHERE "slug" = ${slug}
        LIMIT 1
      `;

      if (listingRows.length === 0) {
        return NextResponse.json(
          {
            ok: false,
            error: "Listing not found.",
          },
          { status: 404 }
        );
      }

      if (listingRows[0].status !== "ACTIVE") {
        return NextResponse.json(
          {
            ok: false,
            error:
              "This treasure is no longer available for purchase.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          ok: false,
          error:
            "Another buyer is currently checking out with this treasure. Please try again shortly.",
          code: "TREASURE_RESERVED",
        },
        { status: 409 }
      );
    }

    const listing = reservationRows[0];

    const listingId = String(listing.id);
    const listingSlug = String(listing.slug);
    const listingTitle = String(listing.title);
    const sellerId = String(listing.sellerId);
    const priceInCents = Number(listing.priceCents);

    reservationContext = {
      databaseUrl,
      listingId,
      reservationId,
    };

    const sellerRows = await sql`
      SELECT
        "id",
        "name",
        "stripeAccountId"
      FROM "Seller"
      WHERE "id" = ${sellerId}
      LIMIT 1
    `;

    if (sellerRows.length === 0) {
      throw new Error("Seller could not be found.");
    }

    const seller = sellerRows[0];
    const sellerName = String(seller.name);

    const sellerStripeAccountId =
      seller.stripeAccountId
        ? String(seller.stripeAccountId)
        : "";

    if (
      !Number.isInteger(priceInCents) ||
      priceInCents <= 0
    ) {
      throw new Error(
        "Listing has an invalid purchase price."
      );
    }

    if (!sellerStripeAccountId) {
      throw new Error(
        "Seller is not connected to Stripe."
      );
    }

    const feePercent =
      DEFAULT_HARBOR_FEE_PERCENT;

    const harborFeeInCents = Math.round(
      priceInCents * (feePercent / 100)
    );

    const sellerAmountInCents =
      priceInCents - harborFeeInCents;

    const stripe = new Stripe(secretKey);

    const transferGroup =
      `DJ-${listingId}-${Date.now()}`;

    const origin =
      request.headers.get("origin") ||
      "http://localhost:3000";

    const metadata = {
      listingId,
      listingSlug,
      buyerUserId,
      sellerId,
      sellerName,
      sellerStripeAccountId,
      reservationId,
      feePercent: String(feePercent),
      harborFeeInCents:
        String(harborFeeInCents),
      sellerAmountInCents:
        String(sellerAmountInCents),
      transferGroup,
    };

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "usd",

              product_data: {
                name: listingTitle,
                description:
                  `Sold by ${sellerName}`,
              },

              unit_amount: priceInCents,
            },

            quantity: 1,
          },
        ],

        payment_intent_data: {
          application_fee_amount:
            harborFeeInCents,

          transfer_data: {
            destination:
              sellerStripeAccountId,
          },

          transfer_group: transferGroup,

          metadata,
        },

        metadata,

        success_url:
          `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/checkout?item=${encodeURIComponent(
            listingSlug
          )}`,

        
        expires_at:
          Math.floor(Date.now() / 1000) +
          30 * 60,
      });

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
    // If Stripe checkout creation fails after we reserved
    // the treasure, release only this request's reservation.
    if (reservationContext) {
      try {
        const releaseSql = neon(
          reservationContext.databaseUrl
        );

        await releaseSql`
          UPDATE "Listing"
          SET
            "reservedByUserId" = NULL,
            "reservedUntil" = NULL,
            "reservationId" = NULL,
            "updatedAt" = NOW()
          WHERE
            "id" = ${reservationContext.listingId}
            AND "reservationId" =
              ${reservationContext.reservationId}
        `;
      } catch (releaseError) {
        console.error(
          "Unable to release checkout reservation:",
          releaseError
        );
      }
    }

    console.error(
      "Stripe checkout session error:",
      error
    );

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