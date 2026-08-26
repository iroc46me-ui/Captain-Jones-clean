"use client";

import { useEffect, useState } from "react";
import FeaturedMarketplace from "../components/FeaturedMarketplace";

type DatabaseListing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  category: string;
  seller: string;
  createdAt?: string;
};

type FreshItem = {
  title: string;
  slug: string;
  price: string;
  tag: string;
  seller: string;
  description: string;
};

export default function FreshArrivalsPage() {
  const [items, setItems] = useState<FreshItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadFreshArrivals() {
      try {
        const response = await fetch("/api/listings", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Fresh Arrivals could not be loaded."
          );
        }

        const freshItems = (data.listings as DatabaseListing[])
          .slice(0, 5)
          .map((listing) => ({
            title: listing.title,
            slug: listing.slug,
            price: `$${(listing.priceCents / 100).toFixed(2)}`,
            tag: listing.category,
            seller: listing.seller,
            description: listing.description,
          }));

        setItems(freshItems);
      } catch (error) {
        console.error("Unable to load Fresh Arrivals:", error);

        setLoadError(
          error instanceof Error
            ? error.message
            : "Fresh Arrivals could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }

    loadFreshArrivals();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-amber-200">
        Loading fresh treasure...
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-3xl border border-red-400/30 bg-red-400/10 p-8">
          {loadError}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <FeaturedMarketplace items={items} />
    </main>
  );
}