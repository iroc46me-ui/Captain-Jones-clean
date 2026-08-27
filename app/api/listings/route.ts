import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    if (body.action === "reactivate") {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { error: "DATABASE_URL is missing." },
      { status: 500 }
    );
  }

  const { slug } = body;

  if (!slug) {
    return NextResponse.json(
      { error: "Listing slug is required." },
      { status: 400 }
    );
  }

  const sql = neon(databaseUrl);

  const listings = await sql`
    UPDATE "Listing"
    SET
      "status" = 'ACTIVE',
      "updatedAt" = NOW()
    WHERE "slug" = ${slug}
    RETURNING *
  `;

  if (listings.length === 0) {
    return NextResponse.json(
      { error: "Listing not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    listing: listings[0],
  });
}

    const {
      title,
      slug,
      description,
      price,
      category,
      condition,
      shipping,
      seller,
      imageUrl
    } = body;

    if (
      !title ||
      !slug ||
      !description ||
      !price ||
      !category ||
      !seller
    ) {
      return NextResponse.json(
        { error: "Required listing information is missing." },
        { status: 400 }
      );
    }

    const numericPrice = Number(
      String(price)
        .replace("$", "")
        .replace(",", "")
        .trim()
    );

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { error: "A valid price is required." },
        { status: 400 }
      );
    }

    const priceCents = Math.round(numericPrice * 100);

    const sql = neon(databaseUrl);

    const sellers = await sql`
      SELECT "id", "name"
      FROM "Seller"
      WHERE "name" = ${seller}
      LIMIT 1
    `;

    if (sellers.length === 0) {
      return NextResponse.json(
        { error: "Seller was not found in the database." },
        { status: 404 }
      );
    }

    const sellerRecord = sellers[0];

    const listings = await sql`
      INSERT INTO "Listing"
        (
          "id",
          "title",
          "slug",
          "description",
          "priceCents",
          "category",
          "condition",
          "shipping",
          "imageUrl",
          "status",
          "sellerId",
          "createdAt",
          "updatedAt"
        )
      VALUES
        (
          gen_random_uuid()::text,
          ${title.trim()},
          ${slug.trim()},
          ${description.trim()},
          ${priceCents},
          ${category},
          ${condition || null},
          ${shipping || null},
          ${imageUrl || null},
          'ACTIVE',
          ${sellerRecord.id},
          NOW(),
          NOW()
        )
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        listing: listings[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unable to create listing:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The listing could not be saved.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const sql = neon(databaseUrl);
    const url = new URL(request.url);
const includeInactive =
  url.searchParams.get("includeInactive") === "true";

    const listings = await sql`
      SELECT
        l."id",
        l."slug",
        l."title",
        l."description",
        l."priceCents",
        l."category",
        l."condition",
        l."shipping",
        l."imageUrl",
        l."status",
        l."createdAt",
        s."name" AS "seller"
      FROM "Listing" l
      JOIN "Seller" s
        ON s."id" = l."sellerId"
      WHERE (
  ${includeInactive} = true
  OR l."status" = 'ACTIVE'
)
ORDER BY l."createdAt" DESC
    `;

    return NextResponse.json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error("Unable to load listings:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Listings could not be loaded.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Listing slug is required." },
        { status: 400 }
      );
    }

    const sql = neon(databaseUrl);

    const listings = await sql`
      SELECT
        l."id",
        l."slug",
        l."title",
        l."description",
        l."priceCents",
        l."category",
        l."condition",
        l."shipping",
        l."imageUrl",
        l."status",
        l."createdAt",
        s."name" AS "seller"
      FROM "Listing" l
      JOIN "Seller" s
        ON s."id" = l."sellerId"
      WHERE l."slug" = ${slug}
      LIMIT 1
    `;

    if (listings.length === 0) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      listing: listings[0],
    });
  } catch (error) {
    console.error("Unable to load listing:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Listing could not be loaded.",
      },
      { status: 500 }
    );
  }
}
export async function PATCH(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      slug,
      title,
      price,
      category,
      condition,
      description,
      shipping,
    } = body;

    if (
      !slug ||
      !title ||
      !price ||
      !category ||
      !description
    ) {
      return NextResponse.json(
        { error: "Required listing information is missing." },
        { status: 400 }
      );
    }

    const numericPrice = Number(
      String(price)
        .replace("$", "")
        .replace(",", "")
        .trim()
    );

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return NextResponse.json(
        { error: "A valid price is required." },
        { status: 400 }
      );
    }

    const priceCents = Math.round(numericPrice * 100);

    const sql = neon(databaseUrl);

    const listings = await sql`
      UPDATE "Listing"
      SET
        "title" = ${title.trim()},
        "description" = ${description.trim()},
        "priceCents" = ${priceCents},
        "category" = ${category},
        "condition" = ${condition || null},
        "shipping" = ${shipping || null},
        "updatedAt" = NOW()
      WHERE "slug" = ${slug}
      RETURNING *
    `;

    if (listings.length === 0) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      listing: listings[0],
    });
  } catch (error) {
    console.error("Unable to update listing:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The listing could not be updated.",
      },
      { status: 500 }
    );
  }
}
export async function DELETE(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Listing slug is required." },
        { status: 400 }
      );
    }

    const sql = neon(databaseUrl);

    const listings = await sql`
      UPDATE "Listing"
      SET
        "status" = 'INACTIVE',
        "updatedAt" = NOW()
      WHERE "slug" = ${slug}
      RETURNING *
    `;

    if (listings.length === 0) {
      return NextResponse.json(
        { error: "Listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      listing: listings[0],
    });
  } catch (error) {
    console.error("Unable to deactivate listing:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The listing could not be deactivated.",
      },
      { status: 500 }
    );
  }
}