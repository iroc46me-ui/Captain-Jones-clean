
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { ensureUser } from "../../../lib/ensure-user";

function getDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return neon(databaseUrl);
}

function errorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "Request failed.";

  if (message === "Unauthorized.") {
    return NextResponse.json(
      { success: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  console.error("Saved sellers API error:", error);

  return NextResponse.json(
    { success: false, error: "Unable to process saved sellers." },
    { status: 500 }
  );
}

// Retrieve the signed-in buyer's saved sellers.
export async function GET() {
  try {
    const user = await ensureUser();
    const sql = getDatabase();

    const sellers = await sql`
      SELECT
        s."id",
        s."name",
        ss."createdAt" AS "savedAt"
      FROM "SavedSeller" ss
      INNER JOIN "Seller" s
        ON s."id" = ss."sellerId"
      WHERE ss."userId" = ${user.id}
      ORDER BY ss."createdAt" DESC
    `;

    return NextResponse.json({
      success: true,
      sellers,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// Save a seller to the signed-in buyer's Locker.
export async function POST(request: Request) {
  try {
    const user = await ensureUser();
    const body = await request.json().catch(() => null);
    const sellerId = body?.sellerId;

    if (typeof sellerId !== "string" || !sellerId.trim()) {
      return NextResponse.json(
        { success: false, error: "Valid sellerId required." },
        { status: 400 }
      );
    }

    const sql = getDatabase();

    const saved = await sql`
      INSERT INTO "SavedSeller"
        ("id", "userId", "sellerId", "createdAt")
      SELECT
        gen_random_uuid()::text,
        ${user.id},
        s."id",
        NOW()
      FROM "Seller" s
      WHERE s."id" = ${sellerId}
      ON CONFLICT ("userId", "sellerId") DO NOTHING
      RETURNING "sellerId"
    `;

    if (saved.length === 0) {
      const existing = await sql`
        SELECT "sellerId"
        FROM "SavedSeller"
        WHERE "userId" = ${user.id}
          AND "sellerId" = ${sellerId}
        LIMIT 1
      `;

      if (existing.length === 0) {
        return NextResponse.json(
          { success: false, error: "Seller not found." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      sellerId,
      saved: true,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

// Remove a saved seller from the signed-in buyer's Locker.
export async function DELETE(request: Request) {
  try {
    const user = await ensureUser();
    const body = await request.json().catch(() => null);
    const sellerId = body?.sellerId;

    if (typeof sellerId !== "string" || !sellerId.trim()) {
      return NextResponse.json(
        { success: false, error: "Valid sellerId required." },
        { status: 400 }
      );
    }

    const sql = getDatabase();

    await sql`
      DELETE FROM "SavedSeller"
      WHERE "userId" = ${user.id}
        AND "sellerId" = ${sellerId}
    `;

    return NextResponse.json({
      success: true,
      sellerId,
      saved: false,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
