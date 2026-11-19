
import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { ensureUser } from "../../../lib/ensure-user";

export async function GET() {
  try {
    const user = await ensureUser();

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error("DATABASE_URL is not configured.");
    }

    const sql = neon(databaseUrl);

    const sellers = await sql`
      SELECT "id", "name"
      FROM "Seller"
      WHERE "userId" = ${user.id}
      LIMIT 1
    `;

    return NextResponse.json({
      success: true,
      user,
      seller: sellers[0] ?? null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "User could not be loaded.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: message === "Unauthorized." ? 401 : 500,
      }
    );
  }
}
