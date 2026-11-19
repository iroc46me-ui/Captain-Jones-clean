"use client";

import { useEffect, useState } from "react";
import { sellers } from "../../lib/sellers";

export default function HarborSellersPage() {
    const [savedSellerIds, setSavedSellerIds] = useState<string[]>([]);
  const [savingSellerId, setSavingSellerId] = useState<string | null>(null);
  const [saveSellerError, setSaveSellerError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSavedSellers() {
      try {
        const response = await fetch("/api/saved-sellers", {
          cache: "no-store",
        });

        if (response.status === 401) {
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load saved sellers.");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.sellers)) {
          setSavedSellerIds(
            data.sellers.map((seller: { id: string }) => seller.id)
          );
        }
      } catch (error) {
        console.error("Unable to load saved sellers:", error);
        setSaveSellerError("Saved sellers could not be loaded.");
      }
    }

    loadSavedSellers();
  }, []);

  async function toggleSavedSeller(sellerId: string) {
    if (savingSellerId) return;

    const alreadySaved = savedSellerIds.includes(sellerId);

    setSavingSellerId(sellerId);
    setSaveSellerError(null);

    try {
      const response = await fetch("/api/saved-sellers", {
        method: alreadySaved ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerId }),
      });

      if (response.status === 401) {
        setSaveSellerError(
          "Please sign in to save your favorite sellers."
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to update saved seller.");
      }

      setSavedSellerIds((current) =>
        alreadySaved
          ? current.filter((id) => id !== sellerId)
          : current.includes(sellerId)
            ? current
            : [...current, sellerId]
      );
    } catch (error) {
      console.error("Save Seller failed:", error);
      setSaveSellerError(
        "Unable to update your saved sellers. Please try again."
      );
    } finally {
      setSavingSellerId(null);
    }
  }

  return (
    <main
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-fixed bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/harbor-sellers-background.png')",
      }}  
    >
      <div className="min-h-screen bg-slate-950/15">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">
            Seller Directory
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
            The Crew&apos;s Nest
          </h1>
{saveSellerError && (
  <div
    role="alert"
    className="mt-5 max-w-3xl rounded-xl border border-amber-300/40 bg-slate-950/80 px-5 py-3 text-amber-200"
  >
    {saveSellerError}
  </div>
)}
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            Trusted sellers, unusual treasures, and independent storefronts
            from around the Harbor.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {sellers.map((seller) => (
              <article
                key={seller.name}
                className="rounded-[2rem] border border-amber-300/30 bg-slate-950/55 p-8 shadow-2xl backdrop-blur-sm"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-amber-300/20 bg-black/40 text-5xl">
                    {seller.icon}
                  </div>

                  <div>
                    <h2 className="text-3xl font-black text-amber-200">
                      {seller.name}
                    </h2>

                    <a
  href={`/harbor-sellers/${seller.id}`}
  className="mt-4 inline-block rounded-full border border-amber-300/40 px-5 py-2 font-black text-amber-200 transition hover:bg-amber-300 hover:text-slate-950"
>
  Visit Seller Harbor
</a>

                    <button
                      type="button"
                      onClick={() => toggleSavedSeller(seller.id)}
                      disabled={savingSellerId !== null}
                      aria-pressed={savedSellerIds.includes(seller.id)}
                      className="mt-3 ml-3 inline-block rounded-full border border-cyan-300/50 bg-slate-950/60 px-5 py-2 font-black text-cyan-200 transition hover:bg-cyan-300 hover:text-slate-950 disabled:cursor-wait disabled:opacity-60"
                    >
                      {savingSellerId === seller.id
                        ? "Saving..."
                        : savedSellerIds.includes(seller.id)
                          ? "★ Saved Seller"
                          : "☆ Save Seller"}
                    </button>

                    <p className="mt-4 text-sm text-slate-300">
  Explore this seller&apos;s treasures and available listings.
</p>
                  </div>
                </div>

                <div className="mt-7 space-y-2 text-slate-200">
                  <p>📍 {seller.location}</p>
                  <p>⚒️ {seller.category}</p>
                  <p>⭐ Trusted Harbor Seller</p>
                  <p>📦 Ships Throughout the United States</p>
                  <p>🏴‍☠️ {seller.memberSince}</p>
                  <p>⭐⭐⭐⭐⭐ {seller.rating}</p>
                  <p>⚡ {seller.response}</p>
                  <p>🎯 Specialty: {seller.specialty}</p>
                  <p>Listings: {seller.listings}</p>
                </div>

                <div
                  id={seller.name
                    .replaceAll(" ", "-")
                    .replaceAll("'", "")
                    .toLowerCase()}
                  className="mt-8"
                >
                  <h3 className="text-xl font-black text-amber-200">
                    Seller Inventory
                  </h3>

                  <div className="mt-4 space-y-3">
                    {seller.inventory.map((item) => (
                      <a
                        key={item.title}
                        href={item.href}
                        className="block rounded-xl border border-white/10 bg-black/35 p-4 font-bold text-white transition hover:border-amber-300/40 hover:bg-black/55"
                      >
                        {item.title} — {item.price}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <a
            href="/"
            className="mt-10 inline-block rounded-full border border-amber-300/40 bg-slate-950/70 px-6 py-3 font-black text-amber-200 transition hover:bg-amber-300 hover:text-slate-950"
          >
            ← Return to Harbor
          </a>
        </section>
      </div>
    </main>
  );
}