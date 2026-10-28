
import { put } from "@vercel/blob";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { ensureUser } from "../../../lib/ensure-user";

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  try {
    // Require an authenticated user.
    const user = await ensureUser();

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "Database configuration is missing." },
        { status: 500 }
      );
    }

    // Only registered sellers may upload listing images.
    const sql = neon(databaseUrl);

    const sellers = await sql`
      SELECT "id"
      FROM "Seller"
      WHERE "userId" = ${user.id}
      LIMIT 1
    `;

    if (sellers.length === 0) {
      return NextResponse.json(
        { error: "Seller account was not found." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file received." },
        { status: 400 }
      );
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed." },
        { status: 400 }
      );
    }

    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image must be smaller than 5 MB." },
        { status: 400 }
      );
    }

    // Preserve the existing Vercel Blob upload behavior.
    const blob = await put(
      `listing-images/${Date.now()}-${file.name}`,
      file,
      {
        access: "public",
        addRandomSuffix: true,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }
    );

    return NextResponse.json({
      success: true,
      url: blob.url,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Unauthorized."
    ) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    console.error("IMAGE UPLOAD ERROR:", error);

    return NextResponse.json(
      { error: "Image upload failed." },
      { status: 500 }
    );
  }
}
