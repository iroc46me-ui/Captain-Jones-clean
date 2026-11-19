
"use client";

import Link from "next/link";
import { getSellerById } from "../../../lib/sellers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Listing = {
  id: string;
  sellerId: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  category: string;
  imageUrl?: string | null;
  seller: string;
};

export default function SellerStorefrontPage() {
  const params = useParams();
  const sellerId = params.sellerId as string;

  const [listings, setListings] = useState<Listing[]>([]);
  const [sellerName, setSellerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStorefront() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/listings", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to load seller inventory."
          );
        }

        const sellerListings = (
          (data.listings || []) as Listing[]
        ).filter(
          (listing) => listing.sellerId === sellerId
        );

        setListings(sellerListings);
        setSellerName(
  sellerListings[0]?.seller || getSellerById(sellerId)?.name || ""
);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load this storefront."
        );
      } finally {
        setLoading(false);
      }
    }

    if (sellerId) {
      loadStorefront();
    }
  }, [sellerId]);

  return (
    <main
  className="min-h-screen bg-[#071116] bg-cover bg-center bg-fixed bg-no-repeat px-6 py-12 text-stone-100"
  style={{
    backgroundImage:
  sellerId === "old-harbor-finds"
    ? "url('/old-harbor-finds-background.png')"
    : sellerId === "daveys-workshop"
      ? "url('/daveys-workshop-background.png')"
      : "none",
  }}
>
      <div className="mx-auto max-w-6xl">
        <Link
          href="/harbor-sellers"
          className="text-sm font-bold text-cyan-300 hover:text-cyan-100"
        >
          ← Back to The Crew&apos;s Nest
        </Link>

        <p className="mt-10 text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">
          Davey Jones Junk-N-Treasure
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold text-amber-200">
          {loading
            ? "Loading Storefront..."
            : sellerName || "Seller Storefront"}
        </h1>

        <p className="mt-4 text-stone-300">
          Explore this seller&apos;s available treasures.
        </p>

        {error && (
          <p className="mt-8 text-red-300">{error}</p>
        )}

        {!loading && !error && listings.length === 0 && (
          <p className="mt-8 text-stone-400">
            No active treasures are available from this seller.
          </p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="overflow-hidden rounded-3xl border border-amber-300/20 bg-slate-950/45 shadow-xl backdrop-blur-sm"
            >
              {listing.imageUrl && (
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="h-52 w-full object-cover"
                />
              )}

              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                  {listing.category}
                </p>

                <h2 className="mt-3 text-xl font-bold text-amber-200">
                  {listing.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm text-stone-300">
                  {listing.description}
                </p>

                <p className="mt-5 text-2xl font-black text-amber-200">
                  ${(listing.priceCents / 100).toFixed(2)}
                </p>

                <Link
                  href={`/listing/${listing.slug}`}
                  className="mt-5 inline-block rounded-full bg-amber-300 px-5 py-2 font-bold text-slate-950 hover:bg-amber-200"
                >
                  View Treasure
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
