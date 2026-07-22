"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import HarborWatchButton from "./HarborWatchButton";

type MarketplaceItem = {
  title: string;
  slug: string;
  price: string;
  category: string;
  tag: string;
  seller: string;
  description: string;
  condition?: string;
  shipping?: string;
  status?: string;
  createdAt?: string;
};

const PUBLISHED_LISTINGS_KEY =
  "davey-jones-published-listings";

const sampleItems: MarketplaceItem[] = [
  {
    title: "Vintage Brass Ship Lantern",
    slug: "vintage-brass-ship-lantern",
    price: "$68",
    category: "Antiques",
    tag: "Captain's Pick",
    seller: "Old Harbor Finds",
    description:
      "A weathered brass-style ship lantern with old harbor character.",
  },
  {
    title: "Desert Nugget Digger",
    slug: "desert-nugget-digger",
    price: "$75",
    category: "Gold & Prospecting",
    tag: "Handmade Tool",
    seller: "Davey's Workshop",
    description:
      "A rugged handmade prospecting tool built for scraping bedrock and working desert ground.",
  },
  {
    title: "Old Coin & Relic Lot",
    slug: "old-coin-relic-lot",
    price: "$42",
    category: "Collectibles",
    tag: "Treasure Bin",
    seller: "Relic Rider",
    description:
      "A small mystery-style relic lot with old coins, metal finds and forgotten pieces.",
  },
  {
    title: "RV Parts Mystery Box",
    slug: "rv-parts-mystery-box",
    price: "$35",
    category: "RV & Auto",
    tag: "Useful Junk",
    seller: "Road Dog Salvage",
    description:
      "A useful mixed box of RV and road-life parts, hardware and fittings.",
  },
  {
    title: "Prospector's Brass Scale",
    slug: "prospectors-brass-scale",
    price: "$88",
    category: "Gold & Prospecting",
    tag: "Field Gear",
    seller: "Quartzsite Cache",
    description:
      "A compact brass-style field scale made for weighing small finds and gold.",
  },
  {
    title: "Estate Drawer Oddities",
    slug: "estate-drawer-oddities",
    price: "$29",
    category: "Estate Finds",
    tag: "Oddities",
    seller: "Second Drawer Co.",
    description:
      "A curious estate drawer bundle filled with small forgotten objects and unusual finds.",
  },
];

const categories = [
  "Gold & Prospecting",
  "Antiques",
  "Tools",
  "RV & Auto",
  "Collectibles",
  "Handmade",
  "Estate Finds",
  "Oddities",
  "Local Pickup",
  "Captain's Picks",
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
  "Captain's Picks": "🏴‍☠️",
};

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Treasure");
  const [publishedItems, setPublishedItems] = useState<
    MarketplaceItem[]
  >([]);

  useEffect(() => {
    function loadPublishedListings() {
      try {
        const saved = JSON.parse(
          localStorage.getItem(PUBLISHED_LISTINGS_KEY) || "[]"
        ) as MarketplaceItem[];

        setPublishedItems(
          saved.map((item) => ({
            ...item,
            tag: item.tag || "New Listing",
          }))
        );
      } catch {
        localStorage.removeItem(PUBLISHED_LISTINGS_KEY);
        setPublishedItems([]);
      }
    }

    loadPublishedListings();

    window.addEventListener(
      "storage",
      loadPublishedListings
    );

    window.addEventListener(
      "published-listings-updated",
      loadPublishedListings
    );

    return () => {
      window.removeEventListener(
        "storage",
        loadPublishedListings
      );

      window.removeEventListener(
        "published-listings-updated",
        loadPublishedListings
      );
    };
  }, []);

  const allItems = useMemo(
    () => [...publishedItems, ...sampleItems],
    [publishedItems]
  );

  const visibleItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return allItems.filter((item) => {
      const searchableText =
        `${item.title} ${item.category} ${item.seller} ${item.tag} ${item.description}`.toLowerCase();

      const matchesSearch =
        normalizedQuery === "" ||
        searchableText.includes(normalizedQuery);

      const matchesCategory =
        selectedCategory === "All Treasure" ||
        (selectedCategory === "Captain's Picks"
          ? item.tag.toLowerCase().includes("captain")
          : item.category === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [allItems, query, selectedCategory]);

  return (
    <section
      id="marketplace"
      className="bg-gradient-to-b from-cyan-950 to-slate-950 px-4 py-5 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">
              Marketplace
            </p>

            <h2 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Treasure by Category
            </h2>

            <p className="mt-3 max-w-2xl text-slate-300">
              Search the deck, explore the categories and place memorable
              finds under Harbor Watch.
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search the Treasure Deck..."
              className="w-full rounded-2xl border border-cyan-300/20 bg-slate-950/70 py-3 pl-12 pr-4 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/20"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["All Treasure", ...categories].map(
            (category) => {
              const isActive =
                selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "scale-105 border-amber-300 bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/40"
                      : "border-cyan-300/30 bg-cyan-400/10 text-white hover:-translate-y-1 hover:border-amber-300/70"
                  }`}
                >
                  {category}
                </button>
              );
            }
          )}
        </div>

        <div
          key={`${selectedCategory}-${query}-${publishedItems.length}`}
          className="mt-4 grid gap-4 animate-[fadeInUp_400ms_ease-out] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visibleItems.map((item, index) => (
            <a
              
              key={`${item.slug}-${index}`}
              href={`/listing/${item.slug}`}
              className="group relative block rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl transition-all duration-300 hover:-translate-y-3 hover:scale-[1.02] hover:border-amber-200/60 hover:shadow-2xl hover:shadow-cyan-400/30"
            >
              <HarborWatchButton
                item={{
                  title: item.title,
                  slug: item.slug,
                  price: item.price,
                  category: item.category,
                  seller: item.seller,
                }}
              />

              <div className="flex h-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600/50 to-cyan-950/60">
                <span
                  className="text-5xl"
                  aria-hidden="true"
                >
                  {categoryIcons[item.category] ?? "⚓"}
                </span>
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
                {item.tag || "New Listing"}
              </p>

              <h3 className="mt-2 pr-12 text-xl font-black text-white">
                {item.title}
              </h3>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-2xl font-black text-amber-200">
                  {item.price}
                </span>

                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-slate-200">
                  {item.category}
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-400">
                Seller: {item.seller}
              </p>
            </a>
          ))}
        </div>

        {visibleItems.length === 0 && (
          <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-white/[0.04] px-6 py-14 text-center">
            <p className="font-serif text-2xl text-amber-200">
              No treasure found
            </p>

            <p className="mt-2 text-slate-400">
              Try another search or choose a different category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}