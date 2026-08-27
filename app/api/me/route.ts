import { NextResponse } from "next/server";
import { ensureUser } from "../../../lib/ensure-user";

export async function GET() {
  try {
    const user = await ensureUser();

    return NextResponse.json({
      success: true,
      user,
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