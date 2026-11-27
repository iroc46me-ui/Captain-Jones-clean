export const STANDARD_HARBOR_FEE_PERCENT = 5;
export const FOUNDING_HARBOR_FEE_PERCENT = 3;
export const FOUNDING_ENROLLMENT_DAYS = 90;
export const FOUNDING_PROMOTION_MONTHS = 6;

export type FoundingSeller = {
  foundingCrewJoinedAt: Date | string | null;
  foundingFeeStartsAt: Date | string | null;
  foundingFeeEndsAt: Date | string | null;
};

export function getHarborFeePercent(
  seller: FoundingSeller,
  now: Date = new Date()
): number {
  if (
    !seller.foundingCrewJoinedAt ||
    !seller.foundingFeeStartsAt ||
    !seller.foundingFeeEndsAt
  ) {
    return STANDARD_HARBOR_FEE_PERCENT;
  }

  const joined = new Date(seller.foundingCrewJoinedAt).getTime();
  const starts = new Date(seller.foundingFeeStartsAt).getTime();
  const ends = new Date(seller.foundingFeeEndsAt).getTime();
  const current = now.getTime();

  if (
    Number.isFinite(joined) &&
    Number.isFinite(starts) &&
    Number.isFinite(ends) &&
    joined <= starts &&
    starts < ends &&
    current >= starts &&
    current < ends
  ) {
    return FOUNDING_HARBOR_FEE_PERCENT;
  }

  return STANDARD_HARBOR_FEE_PERCENT;
}
