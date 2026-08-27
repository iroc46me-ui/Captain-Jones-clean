import { auth, currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function ensureUser() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing.");
  }

  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized.");
  }

  const sql = neon(databaseUrl);

  const existingUsers = await sql`
    SELECT
      "id",
      "clerkUserId",
      "email",
      "name"
    FROM "User"
    WHERE "clerkUserId" = ${userId}
    LIMIT 1
  `;

  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Clerk user could not be loaded.");
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    null;

  const displayName =
    [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || null;

  const users = await sql`
    INSERT INTO "User"
      (
        "id",
        "clerkUserId",
        "email",
        "name",
        "createdAt",
        "updatedAt"
      )
    VALUES
      (
        gen_random_uuid()::text,
        ${userId},
        ${primaryEmail},
        ${displayName},
        NOW(),
        NOW()
      )
    ON CONFLICT ("clerkUserId")
    DO UPDATE SET
      "email" = EXCLUDED."email",
      "name" = EXCLUDED."name",
      "updatedAt" = NOW()
    RETURNING
      "id",
      "clerkUserId",
      "email",
      "name"
  `;

  return users[0];
}