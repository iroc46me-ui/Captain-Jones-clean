"use client";

import { useEffect, useState } from "react";
import { sellers } from "../../lib/sellers";

export default function HarborSellersPage() {
  const [stripeVerified, setStripeVerified] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadStripeStatuses() {
      const results = await Promise.all(
        sellers.map(async (seller) => {
          try {
            const response = await fetch(
              `/api/seller-payment-status?sellerId=${encodeURIComponent(seller.id)}`,
              { cache: "no-store" }
            );

            const data = await response.json();

            return [
              seller.id,
              response.ok && data.ok === true &&
              data.readyForPayouts === true
            ] as const;
          } catch {
            return [seller.id, false] as const;
          }
        })
      );

      if (!cancelled) {
        setStripeVerified(Object.fromEntries(results));
      }
    }

    loadStripeStatuses();

    return () => {
      cancelled = true;
    };
  }, []);

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
      <div className="min-h-screen bg-slate-950/5">
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">
            Seller Directory
          </p>

          <h1 className="mt-4 break-words text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
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

          <div className="mt-8 grid min-w-0 gap-5 lg:grid-cols-2">
            {sellers.map((seller) => (
              <article
                key={seller.name}
                className="min-w-0 rounded-2xl border border-amber-300/35 bg-slate-950/10 p-4 shadow-lg sm:p-6"
              >
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-amber-300/30 bg-slate-950/20 text-4xl sm:h-20 sm:w-20">
                    {seller.icon}
                  </div>

                  <div>
                    <h2 className="break-words text-2xl font-black leading-tight text-amber-200 sm:text-3xl">
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
                      className="mt-3 mr-3 inline-block rounded-full border border-cyan-300/50 bg-slate-950/60 px-5 py-2 font-black text-cyan-200 transition hover:bg-cyan-300 hover:text-slate-950 disabled:cursor-wait disabled:opacity-60"
                    >
                      {savingSellerId === seller.id
                        ? "Saving..."
                        : savedSellerIds.includes(seller.id)
                          ? "\u2605 Saved Seller"
                          : "\u2606 Save Seller"}
                    </button>
                    {stripeVerified[seller.id] === true && (
                      <div className="mt-3">
                        <span className="inline-flex max-w-full items-center rounded-full border border-emerald-400/50 bg-emerald-950/60 px-3 py-2 text-xs font-bold text-emerald-300 sm:text-sm">
                          &#10003; Stripe Verified &mdash; Ready for Payouts
                        </span>
                      </div>
                    )}

                    <p className="mt-4 text-sm text-slate-300">
  Explore this seller&apos;s treasures and available listings.
</p>
                  </div>
                </div>

                <div className="mt-7 space-y-2 text-slate-200">
                  <p>&#128205; {seller.location}</p>
                  <p>&#9874; {seller.category}</p>
                  <p>&#10003; Trusted Harbor Seller</p>
                  <p>&#128230; Ships Throughout the United States</p>
                  <p>&#9875; {seller.memberSince}</p>
                  <p>&#9733;&#9733;&#9733;&#9733;&#9733; {seller.rating}</p>
                  <p>&#9889; {seller.response}</p>
                  <p>&#127919; Specialty: {seller.specialty}</p>
                  <p>&#128230; {seller.listings} Active {seller.listings === 1 ? "Listing" : "Listings"}</p>
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
                        {item.title} &mdash; {item.price}
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
            &#8592; Return to Harbor
          </a>
        </section>
      </div>
    </main>
  );
}
