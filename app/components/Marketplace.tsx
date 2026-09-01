"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import TreasureCard from "./TreasureCard";

type MarketplaceItem = {
  title: string;
  slug: string;
  image?: string;
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

type ApiListing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  category: string;
  condition?: string | null;
  shipping?: string | null;
  imageUrl?: string | null;
  status?: string;
  createdAt?: string;
  seller: string;
};

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
    image: "/marketplace-pick.png",
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
  
];

export default function Marketplace() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Treasure");

  const [databaseItems, setDatabaseItems] = useState<
    MarketplaceItem[]
  >([]);

  const [loadingListings, setLoadingListings] = useState(true);

  useEffect(() => {
    async function loadDatabaseListings() {
      try {
        const response = await fetch("/api/listings", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          console.error("Unable to load database listings:", data);
          setDatabaseItems([]);
          return;
        }

        const convertedItems: MarketplaceItem[] = (
          data.listings as ApiListing[]
        ).map((item) => ({
          title: item.title,
          slug: item.slug,
          image: item.imageUrl || undefined,
          price: `$${(item.priceCents / 100).toFixed(2)}`,
          category: item.category,
          tag: "New Listing",
          seller: item.seller,
          description: item.description,
          condition: item.condition || undefined,
          shipping: item.shipping || undefined,
          status: item.status,
          createdAt: item.createdAt,
        }));

        setDatabaseItems(convertedItems);
      } catch (error) {
        console.error("Unable to load database listings:", error);
        setDatabaseItems([]);
      } finally {
        setLoadingListings(false);
      }
    }

    loadDatabaseListings();
  }, []);

  const allItems = useMemo(
    () => [...databaseItems, ...sampleItems],
    [databaseItems]
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
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat px-4 py-5 text-white"
      style={{
        backgroundImage:
          "url('/public-marketplace-background-clean.png')",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
  <Link
    href="/"
    className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-300/40 bg-slate-950/60 px-4 py-2 text-sm font-bold text-amber-100 transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:shadow-[0_0_22px_rgba(252,211,77,0.35)]"
  >
    ⚓ Home
  </Link>

  <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">
    Treasure Deck
  </p>

            <h2 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Treasure by Category
            </h2>

            <p className="mt-3 max-w-2xl text-slate-300">
              Search the deck, explore the categories and place
              memorable finds under Harbor Watch.
            </p>

            {loadingListings && (
              <p className="mt-2 text-sm text-cyan-200">
                Loading fresh treasure...
              </p>
            )}
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
  {["All Treasure", ...categories].map((category) => {
    const isActive = selectedCategory === category;

    if (category === "Local Pickup") {
      return (
        <Link
          key={category}
          href="/local-pickup"
          className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-300/70"
        >
          {category}
        </Link>
      );
    }

    return (
      <button
        key={category}
        type="button"
        onClick={() => setSelectedCategory(category)}
        className={`rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 ${
          isActive
            ? "scale-105 border-amber-300 bg-amber-300 text-slate-950 shadow-lg shadow-amber-300/40"
            : "border-cyan-300/30 bg-cyan-400/10 text-white hover:-translate-y-1 hover:border-amber-300/70"
        }`}
      >
        {category}
      </button>
    );
  })}
</div>

        <div
          key={`${selectedCategory}-${query}-${databaseItems.length}`}
          className="mt-4 grid gap-4 animate-[fadeInUp_400ms_ease-out] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {visibleItems.map((item, index) => (
            <TreasureCard
              key={`${item.slug}-${index}`}
              item={item}
              featured={
                item.title === "Desert Nugget Digger"
              }
            />
          ))}
        </div>

        {visibleItems.length === 0 &&
          !loadingListings && (
            <div className="mt-8 rounded-3xl border border-cyan-300/20 bg-white/[0.04] px-6 py-14 text-center">
              <p className="font-serif text-2xl text-amber-200">
                No treasure found
              </p>

              <p className="mt-2 text-slate-400">
                Try another search or choose a different
                category.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}