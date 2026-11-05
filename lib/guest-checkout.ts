
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function createGuestCheckoutCredential() {
  const token = randomBytes(32).toString("hex");

  return {
    token,
    tokenHash: hashGuestCheckoutCredential(token),
  };
}

export function hashGuestCheckoutCredential(token: string): string {
  return createHash("sha256")
    .update(token, "utf8")
    .digest("hex");
}

export function verifyGuestCheckoutCredential(
  token: string,
  expectedHash: string
): boolean {
  if (!/^[0-9a-f]{64}$/i.test(token)) return false;
  if (!/^[0-9a-f]{64}$/i.test(expectedHash)) return false;

  const actual = Buffer.from(
    hashGuestCheckoutCredential(token),
    "hex"
  );

  const expected = Buffer.from(expectedHash, "hex");

  return timingSafeEqual(actual, expected);
}
