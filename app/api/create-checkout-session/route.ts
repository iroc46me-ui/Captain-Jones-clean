import { NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

const DEFAULT_HARBOR_FEE_PERCENT = 5;

export async function POST(request: Request) {
  try {
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

    const listingRows = await sql`
      SELECT
        l."id" AS "listingId",
        l."slug",
        l."title",
        l."priceCents",
        l."status",
        s."id" AS "sellerId",
        s."name" AS "sellerName",
        s."stripeAccountId"
      FROM "Listing" l
      INNER JOIN "Seller" s
        ON s."id" = l."sellerId"
      WHERE l."slug" = ${slug}
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

    const listing = listingRows[0];

    if (listing.status !== "ACTIVE") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "This treasure is no longer available for purchase.",
        },
        { status: 400 }
      );
    }

    const listingId = String(listing.listingId);
    const listingSlug = String(listing.slug);
    const listingTitle = String(listing.title);
    const sellerId = String(listing.sellerId);
    const sellerName = String(listing.sellerName);

    const priceInCents = Number(listing.priceCents);

    const sellerStripeAccountId =
      listing.stripeAccountId
        ? String(listing.stripeAccountId)
        : "";

    if (
      !Number.isInteger(priceInCents) ||
      priceInCents <= 0
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Listing has an invalid purchase price.",
        },
        { status: 400 }
      );
    }

    if (!sellerStripeAccountId) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Seller is not connected to Stripe.",
        },
        { status: 400 }
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
      });

    return NextResponse.json({
      ok: true,
      url: session.url,
    });
  } catch (error) {
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