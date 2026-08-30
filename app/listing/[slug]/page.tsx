"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Show,
  SignInButton,
} from "@clerk/nextjs";
import HarborWatchButton from "../../components/HarborWatchButton";

type Listing = {
  title: string;
  slug: string;
  price: string;
  category: string;
  tag?: string;
  seller: string;
  description: string;
  image?: string;
  condition?: string;
  shipping?: string;
};

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

  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState("");

  useEffect(() => {
    async function loadListing() {
      try {
        const response = await fetch("/api/listings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });

        const data = await response.json();

        if (response.ok && data.success && data.listing) {
          const databaseListing = data.listing;

          setListing({
            title: databaseListing.title,
            slug: databaseListing.slug,
            price: `$${(
              databaseListing.priceCents / 100
            ).toFixed(2)}`,
            category: databaseListing.category,
            image: databaseListing.imageUrl || undefined,
            tag: "New Listing",
            seller: databaseListing.seller,
            description: databaseListing.description,
            condition:
              databaseListing.condition || undefined,
            shipping:
              databaseListing.shipping || undefined,
          });

          setIsReady(true);
          return;
        }

        const sampleListing = sampleListings.find(
          (item) => item.slug === slug
        );

        setListing(sampleListing || null);
      } catch {
        const sampleListing = sampleListings.find(
          (item) => item.slug === slug
        );

        setListing(sampleListing || null);
      } finally {
        setIsReady(true);
      }
    }

    loadListing();
  }, [slug]);

  async function sendHarborInquiry() {
    if (!listing) return;

    if (!inquiryMessage.trim()) {
      setInquiryStatus(
        "Write a message before sending."
      );
      return;
    }

    try {
      setIsSendingInquiry(true);
      setInquiryStatus("");

      const response = await fetch(
        "/api/harbor-inquiries",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            listingSlug: listing.slug,
            message: inquiryMessage,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        setInquiryStatus(
          "Sign in before sending a Harbor message."
        );
        return;
      }

      if (!response.ok || !data.success) {
        setInquiryStatus(
          data.error ||
            "The Harbor message could not be sent."
        );
        return;
      }

      setInquiryMessage("");

      setInquiryStatus(
        "⚓ Message sent. This conversation is now available in Captain's Locker."
      );
    } catch {
      setInquiryStatus(
        "The Harbor message could not be sent."
      );
    } finally {
      setIsSendingInquiry(false);
    }
  }

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
            This listing may have been removed or may no
            longer be available.
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
    <main
      className="min-h-screen text-stone-100"
      style={{
        backgroundColor: "#071116",
        backgroundImage:
          "url('/treasure-details-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <section className="border-b border-cyan-400/20 bg-transparent">
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

      <section className="mx-auto grid max-w-6xl gap-7 px-6 py-8 sm:px-10 lg:grid-cols-[0.88fr_0.9fr] lg:px-16">
        <div className="mx-auto flex aspect-[4/5] w-[88%] self-start items-center justify-center overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-700/30 to-slate-950">
          {listing.image ? (
            <img
              src={listing.image}
              alt={listing.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="text-8xl"
              aria-hidden="true"
            >
              {categoryIcons[listing.category] || "⚓"}
            </span>
          )}
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
              <dt className="text-stone-400">
                Seller
              </dt>

              <dd className="font-semibold">
                {listing.seller}
              </dd>
            </div>

            <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
              <dt className="text-stone-400">
                Category
              </dt>

              <dd className="font-semibold">
                {listing.category}
              </dd>
            </div>

            <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
              <dt className="text-stone-400">
                Condition
              </dt>

              <dd className="font-semibold">
                {listing.condition || "Not specified"}
              </dd>
            </div>

            <div className="flex justify-between gap-6 border-b border-white/10 pb-3">
              <dt className="text-stone-400">
                Delivery
              </dt>

              <dd className="font-semibold">
                {listing.shipping ||
                  "Shipping calculated later"}
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

            <Show when="signed-in">
              <button
                type="button"
                onClick={() => {
                  setShowInquiryForm(
                    (current) => !current
                  );
                  setInquiryStatus("");
                }}
                className="rounded-full border border-amber-300/50 bg-amber-300/10 px-6 py-3 font-bold text-amber-100 transition hover:bg-amber-300/20"
              >
                {showInquiryForm
                  ? "Close Harbor Message"
                  : "Ask the Seller"}
              </button>
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded-full border border-amber-300/50 bg-amber-300/10 px-6 py-3 font-bold text-amber-100 transition hover:bg-amber-300/20"
                >
                  Sign In to Ask Seller
                </button>
              </SignInButton>
            </Show>

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

          <Show when="signed-in">
            {showInquiryForm && (
              <div className="mt-6 rounded-2xl border border-cyan-300/20 bg-slate-950/50 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  Harbor Inquiry
                </p>

                <h2 className="mt-2 font-serif text-2xl text-amber-200">
                  Ask {listing.seller} about this
                  treasure
                </h2>

                <p className="mt-2 text-sm leading-6 text-stone-400">
                  Your identity comes from your signed-in
                  Captain&apos;s Locker account. Your
                  conversation stays inside the Harbor.
                </p>

                <div className="mt-5 space-y-4">
                  <textarea
                    rows={5}
                    placeholder="Ask the seller a question about this item..."
                    value={inquiryMessage}
                    onChange={(event) =>
                      setInquiryMessage(
                        event.target.value
                      )
                    }
                    className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-cyan-300/50"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={sendHarborInquiry}
                      disabled={isSendingInquiry}
                      className="rounded-full bg-cyan-300 px-6 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSendingInquiry
                        ? "Sending..."
                        : "Send Harbor Message"}
                    </button>

                    <Link
                      href="/captains-locker/messages"
                      className="rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-stone-200 transition hover:bg-white/10"
                    >
                      My Harbor Messages
                    </Link>
                  </div>

                  {inquiryStatus && (
                    <p className="text-sm leading-6 text-amber-100">
                      {inquiryStatus}
                    </p>
                  )}
                </div>
              </div>
            )}
          </Show>
        </div>
      </section>
    </main>
  );
}