"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DatabaseListing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  category: string;
  condition?: string | null;
  shipping?: string | null;
  status: string;
  createdAt?: string;
  seller: string;
};

const SELLER_NAME = "Davey's Workshop";

export default function SellerChestPage() {
  const [listings, setListings] = useState<DatabaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadSellerListings() {
      try {
        const response = await fetch("/api/listings", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          setLoadError(
            data.error || "Seller listings could not be loaded."
          );
          return;
        }

        const sellerListings = (
          data.listings as DatabaseListing[]
        ).filter(
          (listing) => listing.seller === SELLER_NAME
        );

        setListings(sellerListings);
      } catch {
        setLoadError("Seller listings could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadSellerListings();
  }, []);

  const activeListings = useMemo(
    () =>
      listings.filter(
        (listing) => listing.status === "ACTIVE"
      ),
    [listings]
  );

  const sellerStats = [
    {
      label: "Active Listings",
      value: String(activeListings.length),
    },
    {
      label: "Draft Listings",
      value: "0",
    },
    {
      label: "Sold Items",
      value: "0",
    },
    {
      label: "Harbor Messages",
      value: "0",
    },
  ];

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-amber-400/20 bg-gradient-to-r from-[#071116] via-[#10242c] to-[#071116]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-7 sm:px-10 md:flex-row md:items-end lg:px-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Davey Jones Junk-N-Treasure
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
              Seller Chest
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Manage listings, prepare shipments and keep track
              of everything you&apos;re selling around the harbor.
            </p>

            <p className="mt-2 text-sm text-cyan-200">
              Seller: {SELLER_NAME}
            </p>
          </div>

          <Link
            href="/seller-chest/new-listing"
            className="inline-flex w-fit rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-200"
          >
            Create New Listing
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sellerStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
            >
              <p className="text-sm text-stone-400">
                {stat.label}
              </p>

              <p className="mt-2 text-3xl font-black text-amber-200">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-cyan-300/20 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Inventory
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Active Listings
                </h2>
              </div>

              <Link
                href="/treasure-deck"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
              >
                View Treasure Deck
              </Link>
            </div>

            {loading && (
              <p className="mt-6 text-cyan-200">
                Loading seller inventory...
              </p>
            )}

            {loadError && (
              <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-red-200">
                {loadError}
              </div>
            )}

            {!loading &&
              !loadError &&
              activeListings.length === 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-8 text-center">
                  <p className="font-serif text-xl text-amber-200">
                    No Active Treasure
                  </p>

                  <p className="mt-2 text-sm text-stone-400">
                    Create a listing and it will appear here.
                  </p>
                </div>
              )}

            <div className="mt-6 space-y-3">
              {activeListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={`/listing/${listing.slug}`}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 transition hover:border-cyan-300/40 hover:bg-slate-950/70 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-bold">
                      {listing.title}
                    </p>

                    <p className="mt-1 text-sm text-stone-400">
                      Active · {listing.category}
                    </p>
                  </div>

                  <p className="text-xl font-black text-amber-200">
                    $
                    {(listing.priceCents / 100).toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-transparent p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Shipping Queue
            </p>

            <h2 className="mt-2 font-serif text-2xl">
              No Orders Awaiting Shipment
            </h2>

            <p className="mt-4 leading-7 text-stone-400">
              Sold treasures requiring labels and tracking
              information will appear here.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
            >
              Return Home
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}