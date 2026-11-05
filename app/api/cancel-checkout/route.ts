import { NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";
import { verifyGuestCheckoutCredential } from "../../../lib/guest-checkout";

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    
    const { reservationId, guestToken } = await request.json();
    if (typeof reservationId !== "string" || !/^[0-9a-f-]{36}$/i.test(reservationId)) {
      return NextResponse.json({ error: "Invalid reservation" }, { status: 400 });
    }
    const databaseUrl = process.env.DATABASE_URL;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!databaseUrl || !secretKey) return NextResponse.json({ error: "Checkout unavailable" }, { status: 503 });
    const sql = neon(databaseUrl);
    const rows = await sql`
      SELECT l."id", l."stripeCheckoutSessionId", l."reservedByUserId", l."guestCheckoutTokenHash"
      FROM "Listing" l
      LEFT JOIN "User" u ON u."id" = l."reservedByUserId"
      WHERE l."reservationId" = ${reservationId} AND (
  (${clerkUserId} IS NOT NULL AND u."clerkUserId" = ${clerkUserId})
  OR
  (l."reservedByUserId" IS NULL AND l."guestCheckoutTokenHash" IS NOT NULL)
)
      AND l."status" = 'ACTIVE' LIMIT 1
    `;
    if (!rows.length) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    const reservation = rows[0];

if (
  reservation.guestCheckoutTokenHash &&
  (
    typeof guestToken !== "string" ||
    !verifyGuestCheckoutCredential(
      guestToken,
      String(reservation.guestCheckoutTokenHash)
    )
  )
) {
  return NextResponse.json(
    { error: "Reservation not found" },
    { status: 404 }
  );
}
    const sessionId = rows[0].stripeCheckoutSessionId;
    if (!sessionId) return NextResponse.json({ error: "Checkout still preparing" }, { status: 409 });
    const stripe = new Stripe(secretKey);
    let session = await stripe.checkout.sessions.retrieve(String(sessionId));
    if (session.status === "open") {
      try {
        session = await stripe.checkout.sessions.expire(String(sessionId));
      } catch {
        // A concurrent payment may have completed. Recheck Stripe before release.
        session = await stripe.checkout.sessions.retrieve(String(sessionId));
      }
    }
    if (session.status !== "expired" || session.payment_status === "paid") {
      return NextResponse.json({ error: "Checkout may be processing payment" }, { status: 409 });
    }
    const releasedRows = await sql`
      UPDATE "Listing" SET "reservedByUserId" = NULL, "guestCheckoutTokenHash" = NULL, "reservedUntil" = NULL,
      "reservationId" = NULL, "stripeCheckoutSessionId" = NULL, "updatedAt" = NOW()
      WHERE "id" = ${String(rows[0].id)} AND "reservationId" = ${reservationId}
      AND "stripeCheckoutSessionId" = ${String(sessionId)} AND "status" = 'ACTIVE'
RETURNING "id"
    `;
    if (releasedRows.length !== 1) {
  return NextResponse.json(
    { error: "Reservation could not be released" },
    { status: 409 }
  );
}
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Cancel checkout error:", error);
    return NextResponse.json({ error: "Unable to cancel checkout" }, { status: 500 });
  }
}
