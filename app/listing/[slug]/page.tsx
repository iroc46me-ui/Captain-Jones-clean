"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import HarborWatchButton from "../../components/HarborWatchButton";

type Listing = {
  title: string;
  slug: string;
  price: string;
  category: string;
  tag?: string;
  seller: string;
  description: string;
  condition?: string;
  shipping?: string;
};

const PUBLISHED_LISTINGS_KEY = "davey-jones-published-listings";

const sampleListings: Listing[] = [
  {
    title: "Vintage Brass Ship Lantern",
    slug: "vintage-brass-ship-lantern",
    price: "$68",
    category: "Antiques",
    tag: "Captain's Pick",
    seller: "Old Harbor Finds",
    description:
      "A weathered brass-style ship lantern with old harbor character. A strong decorative piece for a nautical room, workshop, cabin or collection.",
    condition: "Good vintage condition",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "Desert Nugget Digger",
    slug: "desert-nugget-digger",
    price: "$75",
    category: "Gold & Prospecting",
    tag: "Handmade Tool",
    seller: "Davey's Workshop",
    description:
      "A rugged handmade prospecting tool built for scraping bedrock and working desert ground. Designed for practical field use.",
    condition: "New handmade item",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "Old Coin & Relic Lot",
    slug: "old-coin-relic-lot",
    price: "$42",
    category: "Collectibles",
    tag: "Treasure Bin",
    seller: "Relic Rider",
    description:
      "A small mystery-style relic lot containing old coins, metal finds and forgotten pieces collected over time.",
    condition: "Mixed vintage condition",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "RV Parts Mystery Box",
    slug: "rv-parts-mystery-box",
    price: "$35",
    category: "RV & Auto",
    tag: "Useful Junk",
    seller: "Road Dog Salvage",
    description:
      "A useful mixed box of RV and road-life parts, hardware and fittings. Contents may suit repairs, spares or workshop use.",
    condition: "Used mixed condition",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "Prospector's Brass Scale",
    slug: "prospectors-brass-scale",
    price: "$88",
    category: "Gold & Prospecting",
    tag: "Field Gear",
    seller: "Quartzsite Cache",
    description:
      "A compact brass-style field scale intended for weighing small finds, gold and collectible pieces.",
    condition: "Good condition",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "Estate Drawer Oddities",
    slug: "estate-drawer-oddities",
    price: "$29",
    category: "Estate Finds",
    tag: "Oddities",
    seller: "Second Drawer Co.",
    description:
      "A curious estate drawer bundle filled with small forgotten objects, unusual pieces and conversation starters.",
    condition: "Mixed estate condition",
    shipping: "Buyer Pays Shipping",
  },
];

const categoryIcons: Record<string, string> = {
  "Gold & Prospecting": "⛏️",
  Antiques: "🏺",
  Tools: "🧰",
  "RV & Auto": "🧭",
  Collectibles: "🪙",
  Handmade: "🔨",
  "Estate Finds": "📜",
  Oddities: "🗝️",
  "Local Pickup": "⚓",
};

export default function ListingPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [listing, setListing] = useState<Listing | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const publishedListings = JSON.parse(
        localStorage.getItem(PUBLISHED_LISTINGS_KEY) || "[]"
      ) as Listing[];

      const foundListing = [...publishedListings, ...sampleListings].find(
        (item) => item.slug === slug
      );

      setListing(foundListing || null);
    } catch {
      const sampleListing = sampleListings.find(
        (item) => item.slug === slug
      );

      setListing(sampleListing || null);
    }

    setIsReady(true);
  }, [slug]);

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071116] text-stone-300">
        Loading treasure...
      </main>
    );
  }

  if (!listing) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071116] px-6 text-stone-100">
        <section className="max-w-xl rounded-3xl border border-amber-300/20 bg-white/[0.05] p-10 text-center">
          <p className="text-5xl">⚓</p>

          <h1 className="mt-5 font-serif text-3xl text-amber-200">
            Treasure Not Found
          </h1>

          <p className="mt-4 text-stone-400">
            This listing may have been removed or may no longer be available.
          </p>

          <Link
            href="/treasure-deck"
            className="mt-7 inline-flex rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950"
          >
            Return to Treasure Deck
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-cyan-400/20 bg-gradient-to-r from-[#071116] via-[#0a2230] to-[#071116]">
        <div className="mx-auto max-w-7xl px-6 py-7 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Davey Jones Junk-N-Treasure
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
            {listing.title}
          </h1>

          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">
            {listing.tag || "New Listing"}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-7 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:px-16">
        <div className="flex min-h-[330px] items-center justify-center rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-700/30 to-slate-950">
          <span className="text-8xl" aria-hidden="true">
            {categoryIcons[listing.category] || "⚓"}
          </span>
        </div>

        <div className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-7">
          <HarborWatchButton
            item={{
              title: listing.title,
              slug: listing.slug,
              price: listing.price,
              category: listing.category,
              seller: listing.seller,
            }}
          />

          <p className="pr-16 text-4xl font-black text-amber-200">
            {listing.price}
          </p>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
              <dt className="text-stone-400">Seller</dt>
              <dd className="font-semibold">{listing.seller}</dd>
            </div>

            <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
              <dt className="text-stone-400">Category</dt>
              <dd className="font-semibold">{listing.category}</dd>
            </div>

            <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
              <dt className="text-stone-400">Condition</dt>
              <dd className="font-semibold">
                {listing.condition || "Not specified"}
              </dd>
            </div>

            <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
              <dt className="text-stone-400">Delivery</dt>
              <dd className="font-semibold">
                {listing.shipping || "Shipping calculated later"}
              </dd>
            </div>
          </dl>

          <p className="mt-6 leading-7 text-stone-300">
            {listing.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/checkout?item=${listing.slug}`}
              className="rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-200"
            >
              Claim This Treasure
            </Link>

            <Link
              href="/harbor-watch"
              className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-6 py-3 font-bold text-cyan-100"
            >
              View Harbor Watch
            </Link>

            <Link
              href="/treasure-deck"
              className="rounded-full border border-white/20 px-6 py-3 font-bold text-stone-200"
            >
              Return to Treasure Deck
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}