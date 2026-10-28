import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { ensureUser } from "../../../lib/ensure-user";

async function getCurrentSeller(databaseUrl: string) {
  const user = await ensureUser();
  const sql = neon(databaseUrl);

  const sellers = await sql`
    SELECT
      "id",
      "name"
    FROM "Seller"
    WHERE "userId" = ${user.id}
    LIMIT 1
  `;

  if (sellers.length === 0) {
    return null;
  }

  return sellers[0];
}

function unauthorizedResponse(error: unknown) {
  if (error instanceof Error && error.message === "Unauthorized.") {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        { error: "DATABASE_URL is missing." },
        { status: 500 }
      );
    }

    const sellerRecord = await getCurrentSeller(databaseUrl);

    if (!sellerRecord) {
      return NextResponse.json(
        { error: "Seller account was not found." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const sql = neon(databaseUrl);

    if (body.action === "reactivate") {
      const { slug } = body;

      if (!slug) {
        return NextResponse.json(
          { error: "Listing slug is required." },
          { status: 400 }
        );
      }

      const listings = await sql`
        UPDATE "Listing"
        SET
          "status" = 'ACTIVE',
          "updatedAt" = NOW()
        WHERE
          "slug" = ${slug}
          AND "sellerId" = ${sellerRecord.id}
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
      imageUrl,
      imageUrls,
    } = body;

    const additionalImages = imageUrls === undefined ? [] : imageUrls;

    const isValidListingImageUrl = (value: unknown): boolean => {
      if (typeof value !== "string") return false;

      try {
        const url = new URL(value);

        return (
          url.protocol === "https:" &&
          url.hostname === "mp0rpnpfnhyvhhfy.public.blob.vercel-storage.com" &&
          url.pathname.startsWith("/listing-images/")
        );
      } catch {
        return false;
      }
    };
    if (
      imageUrl != null &&
      imageUrl !== "" &&
      !isValidListingImageUrl(imageUrl)
    ) {
      return NextResponse.json(
        { error: "Please provide a valid main photo URL." },
        { status: 400 }
      );
    }
    if (
      !Array.isArray(additionalImages) ||
      additionalImages.length > 5 ||
      additionalImages.some(
        (url: unknown) => !isValidListingImageUrl(url)
      )
    ) {
      return NextResponse.json(
        { error: "Please provide up to five valid additional photo URLs." },
        { status: 400 }
      );
    }
    if (
      !title ||
      !slug ||
      !description ||
      !price ||
      !category
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
          "imageUrls",
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
          ARRAY(
  SELECT jsonb_array_elements_text(
    ${JSON.stringify(additionalImages)}::jsonb
  )
),
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
    const unauthorized = unauthorizedResponse(error);

    if (unauthorized) {
      return unauthorized;
    }

    console.error("Unable to create listing:", error);

    return NextResponse.json(
      { error: "The listing could not be saved." },
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

    if (!includeInactive) {
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
          l."imageUrls",
          l."status",
          l."createdAt",
          s."name" AS "seller"
        FROM "Listing" l
        JOIN "Seller" s
          ON s."id" = l."sellerId"
        WHERE l."status" = 'ACTIVE'
        ORDER BY l."createdAt" DESC
      `;

      return NextResponse.json({
        success: true,
        listings,
      });
    }

    const sellerRecord = await getCurrentSeller(databaseUrl);

    if (!sellerRecord) {
      return NextResponse.json(
        { error: "Seller account was not found." },
        { status: 403 }
      );
    }

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
        l."imageUrls",
        l."status",
        l."createdAt",
        s."name" AS "seller"
      FROM "Listing" l
      JOIN "Seller" s
        ON s."id" = l."sellerId"
      WHERE l."sellerId" = ${sellerRecord.id}
      ORDER BY l."createdAt" DESC
    `;

    return NextResponse.json({
      success: true,
      listings,
    });
  } catch (error) {
    const unauthorized = unauthorizedResponse(error);

    if (unauthorized) {
      return unauthorized;
    }

    console.error("Unable to load listings:", error);

    return NextResponse.json(
      { error: "Listings could not be loaded." },
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

    const sellerRecord = await getCurrentSeller(databaseUrl);

    if (!sellerRecord) {
      return NextResponse.json(
        { error: "Seller account was not found." },
        { status: 403 }
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
        l."imageUrls",
        l."status",
        l."createdAt",
        s."name" AS "seller"
      FROM "Listing" l
      JOIN "Seller" s
        ON s."id" = l."sellerId"
      WHERE
        l."slug" = ${slug}
        AND l."sellerId" = ${sellerRecord.id}
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
    const unauthorized = unauthorizedResponse(error);

    if (unauthorized) {
      return unauthorized;
    }

    console.error("Unable to load listing:", error);

    return NextResponse.json(
      { error: "Listing could not be loaded." },
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

    const sellerRecord = await getCurrentSeller(databaseUrl);

    if (!sellerRecord) {
      return NextResponse.json(
        { error: "Seller account was not found." },
        { status: 403 }
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
  imageUrl,
  imageUrls,
} = body;

const photosProvided =
  imageUrl !== undefined || imageUrls !== undefined;

if (photosProvided) {
  const isValidPhotoUrl = (value: unknown): boolean => {
    if (typeof value !== "string") return false;

    try {
      const url = new URL(value);

      return (
        url.protocol === "https:" &&
        url.hostname ===
          "mp0rpnpfnhyvhhfy.public.blob.vercel-storage.com" &&
        url.pathname.startsWith("/listing-images/")
      );
    } catch {
      return false;
    }
  };

  if (
    typeof imageUrl !== "string" ||
    !isValidPhotoUrl(imageUrl) ||
    !Array.isArray(imageUrls) ||
    imageUrls.length > 5 ||
    imageUrls.some(
      (url: unknown) => !isValidPhotoUrl(url)
    )
  ) {
    return NextResponse.json(
      { error: "Please provide one main photo and up to five valid additional photos." },
      { status: 400 }
    );
  }
}

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
"imageUrl" = CASE
  WHEN ${photosProvided}
  THEN ${imageUrl ?? null}
  ELSE "imageUrl"
END,
"imageUrls" = CASE
  WHEN ${photosProvided}
  THEN ARRAY(
  SELECT jsonb_array_elements_text(
    ${JSON.stringify(imageUrls ?? [])}::jsonb
  )
)::text[]
  ELSE "imageUrls"
END,
"updatedAt" = NOW()
      WHERE
        "slug" = ${slug}
        AND "sellerId" = ${sellerRecord.id}
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
    const unauthorized = unauthorizedResponse(error);

    if (unauthorized) {
      return unauthorized;
    }

    console.error("Unable to update listing:", error);

    return NextResponse.json(
      { error: "The listing could not be updated." },
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

    const sellerRecord = await getCurrentSeller(databaseUrl);

    if (!sellerRecord) {
      return NextResponse.json(
        { error: "Seller account was not found." },
        { status: 403 }
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
      WHERE
        "slug" = ${slug}
        AND "sellerId" = ${sellerRecord.id}
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
    const unauthorized = unauthorizedResponse(error);

    if (unauthorized) {
      return unauthorized;
    }

    console.error("Unable to deactivate listing:", error);

    return NextResponse.json(
      { error: "The listing could not be deactivated." },
      { status: 500 }
    );
  }
}