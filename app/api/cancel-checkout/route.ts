import { NextResponse } from "next/server";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    const { reservationId } = await request.json();
    if (typeof reservationId !== "string" || !/^[0-9a-f-]{36}$/i.test(reservationId)) {
      return NextResponse.json({ error: "Invalid reservation" }, { status: 400 });
    }
    const databaseUrl = process.env.DATABASE_URL;
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!databaseUrl || !secretKey) return NextResponse.json({ error: "Checkout unavailable" }, { status: 503 });
    const sql = neon(databaseUrl);
    const rows = await sql`
      SELECT l."id", l."stripeCheckoutSessionId", l."reservedByUserId"
      FROM "Listing" l
      JOIN "User" u ON u."id" = l."reservedByUserId"
      WHERE l."reservationId" = ${reservationId} AND u."clerkUserId" = ${clerkUserId}
      AND l."status" = 'ACTIVE' LIMIT 1
    `;
    if (!rows.length) return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
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
    await sql`
      UPDATE "Listing" SET "reservedByUserId" = NULL, "reservedUntil" = NULL,
      "reservationId" = NULL, "stripeCheckoutSessionId" = NULL, "updatedAt" = NOW()
      WHERE "id" = ${String(rows[0].id)} AND "reservationId" = ${reservationId}
      AND "stripeCheckoutSessionId" = ${String(sessionId)} AND "status" = 'ACTIVE'
    `;
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Cancel checkout error:", error);
    return NextResponse.json({ error: "Unable to cancel checkout" }, { status: 500 });
  }
}
