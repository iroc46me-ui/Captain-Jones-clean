"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type CheckoutListing = {
  title: string;
  slug: string;
  price: string;
  seller: string;
  category?: string;
  shipping?: string;
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const itemSlug = searchParams.get("item");

  const [listing, setListing] =
    useState<CheckoutListing | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] =
    useState(false);
  const [checkoutStatus, setCheckoutStatus] =
    useState("");

  useEffect(() => {
    async function loadListing() {
      if (!itemSlug) {
        setListing(null);
        setIsReady(true);
        return;
      }

      try {
        const response = await fetch("/api/listings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: itemSlug,
          }),
        });

        const data = await response.json();

        if (
          response.ok &&
          data.success &&
          data.listing
        ) {
          const databaseListing = data.listing;

          setListing({
            title: databaseListing.title,
            slug: databaseListing.slug,
            price: `$${(
              databaseListing.priceCents / 100
            ).toFixed(2)}`,
            seller: databaseListing.seller,
            category:
              databaseListing.category || "Treasure",
            shipping:
              databaseListing.shipping ||
              "Calculated later",
          });
        } else {
          setListing(null);
        }
      } catch {
        setListing(null);
      } finally {
        setIsReady(true);
      }
    }

    loadListing();
  }, [itemSlug]);

  async function startStripeCheckout() {
    if (!listing) return;

    try {
      setIsStartingCheckout(true);
      setCheckoutStatus("");

      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: listing.slug,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.url) {
        console.error(
          "Checkout error:",
          data
        );

        setCheckoutStatus(
          data.error ||
            "Unable to start Stripe checkout."
        );

        return;
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(
        "Unable to start checkout:",
        error
      );

      setCheckoutStatus(
        "Unable to start Stripe checkout."
      );
    } finally {
      setIsStartingCheckout(false);
    }
  }

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071116] text-stone-300">
        Preparing Captain&apos;s Checkout...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-amber-400/20 bg-gradient-to-r from-[#071116] via-[#11232b] to-[#071116]">
        <div className="mx-auto max-w-5xl px-6 py-6 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Davey Jones Junk-N-Treasure
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200">
            Captain&apos;s Checkout
          </h1>

          <p className="mt-2 text-stone-300">
            Review your treasure before continuing to
            secure checkout.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-6 py-7 sm:px-10 lg:grid-cols-[1fr_0.85fr] lg:px-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Order Summary
          </p>

          {listing ? (
            <>
              <h2 className="mt-3 font-serif text-3xl text-amber-100">
                {listing.title}
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                  <span className="text-stone-400">
                    Seller
                  </span>

                  <span className="font-semibold">
                    {listing.seller}
                  </span>
                </div>

                <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                  <span className="text-stone-400">
                    Category
                  </span>

                  <span className="font-semibold">
                    {listing.category ||
                      "Treasure"}
                  </span>
                </div>

                <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
                  <span className="text-stone-400">
                    Delivery
                  </span>

                  <span className="font-semibold">
                    {listing.shipping ||
                      "Calculated later"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950/70 px-5 py-4">
                <span className="font-semibold text-stone-300">
                  Item price
                </span>

                <span className="text-3xl font-black text-amber-200">
                  {listing.price}
                </span>
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5">
              <p className="font-semibold text-amber-100">
                This treasure could not be loaded.
              </p>

              <p className="mt-2 text-sm leading-6 text-stone-400">
                Return to the Treasure Deck and select
                the listing again.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-b from-cyan-950/70 to-slate-950 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Secure Checkout
          </p>

          <h2 className="mt-2 font-serif text-2xl">
            Continue to payment
          </h2>

          <p className="mt-4 leading-7 text-stone-400">
            Your selected treasure will be passed to
            Stripe using the listing stored in the
            marketplace database.
          </p>

          <button
            type="button"
            onClick={startStripeCheckout}
            disabled={
              !listing || isStartingCheckout
            }
            className="mt-6 w-full rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isStartingCheckout
              ? "Opening Secure Checkout..."
              : "Continue to Secure Checkout"}
          </button>

          {checkoutStatus && (
            <p className="mt-4 text-sm leading-6 text-amber-100">
              {checkoutStatus}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {itemSlug && (
              <Link
                href={`/listing/${itemSlug}`}
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
              >
                Return to Listing
              </Link>
            )}

            <Link
              href="/treasure-deck"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
            >
              Keep Looking
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#071116] text-stone-300">
          Preparing Captain&apos;s Checkout...
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}