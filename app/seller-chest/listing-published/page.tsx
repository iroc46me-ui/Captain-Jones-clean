"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PublishedListing = {
  title: string;
  price: string;
  category: string;
  seller: string;
  slug: string;
};

export default function ListingPublishedPage() {
  const [listing, setListing] =
    useState<PublishedListing | null>(null);

  useEffect(() => {
    try {
      const savedListing = localStorage.getItem(
        "davey-jones-last-published-listing"
      );

      if (savedListing) {
        setListing(JSON.parse(savedListing));
      }
    } catch {
      setListing(null);
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071116] px-6 py-10 text-stone-100">
      <section className="w-full max-w-3xl rounded-[2rem] border border-amber-300/30 bg-gradient-to-b from-[#10242c] to-[#071116] p-8 text-center shadow-2xl shadow-black/40 sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 text-4xl">
          ⚓
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Davey Jones Junk-N-Treasure
        </p>

        <h1 className="mt-3 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
          Treasure Added to the Harbor
        </h1>

        {listing ? (
          <>
            <p className="mt-5 text-xl font-semibold">
              {listing.title}
            </p>

            <p className="mt-2 text-3xl font-black text-amber-200">
              {listing.price}
            </p>

            <p className="mt-4 text-stone-400">
              Listed by {listing.seller} in {listing.category}.
            </p>
          </>
        ) : (
          <p className="mt-5 text-stone-400">
            Your listing was published in this browser.
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/seller-chest/new-listing"
            className="rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-200"
          >
            Create Another Listing
          </Link>

          <Link
            href="/seller-chest"
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 font-bold text-cyan-100 transition hover:bg-cyan-300/20"
          >
            Return to Seller Chest
          </Link>

          <Link
            href="/treasure-deck"
            className="rounded-full border border-white/20 px-6 py-3 font-bold transition hover:bg-white/10"
          >
            View Treasure Deck
          </Link>
        </div>

        <p className="mt-7 text-xs leading-5 text-stone-500">
          During development, newly published listings are stored only
          in this browser. A shared database will replace this later.
        </p>
      </section>
    </main>
  );
}