
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type SavedSeller = {
  id: string;
  name: string;
  savedAt: string;
};

export default function SavedSellersPage() {
  const [sellers, setSellers] = useState<SavedSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [needsSignIn, setNeedsSignIn] = useState(false);

  useEffect(() => {
    async function loadSellers() {
      try {
        const response = await fetch("/api/saved-sellers", {
          cache: "no-store",
        });

        if (response.status === 401) {
          setNeedsSignIn(true);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load saved sellers.");
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.sellers)) {
          setSellers(data.sellers);
        }
      } catch (error) {
        console.error("Saved Sellers load failed:", error);
        setError("Unable to load your saved sellers.");
      } finally {
        setLoading(false);
      }
    }

    loadSellers();
  }, []);

  async function removeSeller(sellerId: string) {
    if (removingId) return;

    setRemovingId(sellerId);
    setError(null);

    try {
      const response = await fetch("/api/saved-sellers", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerId }),
      });

      if (response.status === 401) {
        setNeedsSignIn(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to remove saved seller.");
      }

      setSellers((current) =>
        current.filter((seller) => seller.id !== sellerId)
      );
    } catch (error) {
      console.error("Remove Seller failed:", error);
      setError("Unable to remove this seller. Please try again.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#071116] px-6 py-12 text-stone-100">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/captains-locker"
          className="text-sm font-bold text-cyan-300 hover:text-cyan-200"
        >
          ← Back to Captain&apos;s Locker
        </Link>

        <p className="mt-10 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
          Your Favorite Harbor Merchants
        </p>

        <h1 className="mt-3 font-serif text-4xl font-bold text-amber-200 sm:text-5xl">
          Saved Sellers
        </h1>

        <p className="mt-4 max-w-2xl leading-7 text-stone-300">
          Keep your favorite sellers close at hand. Visit their
          storefronts whenever you want to discover new treasures.
        </p>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-red-200"
          >
            {error}
          </p>
        )}

        {loading ? (
          <p className="mt-10 text-stone-400">
            Loading your saved sellers...
          </p>
        ) : needsSignIn ? (
          <div className="mt-10 rounded-3xl border border-amber-300/20 bg-white/[0.04] p-8">
            <h2 className="font-serif text-2xl text-amber-200">
              Sign in to view your saved sellers
            </h2>
            <p className="mt-3 text-stone-300">
              Your saved sellers are connected to your Harbor account.
            </p>
            <Link
              href="/sign-in"
              className="mt-6 inline-block rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 hover:bg-amber-200"
            >
              Sign In
            </Link>
          </div>
        ) : sellers.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-white/20 bg-white/[0.04] p-10 text-center">
            <h2 className="font-serif text-2xl text-amber-200">
              No sellers saved yet
            </h2>
            <p className="mt-3 text-stone-400">
              Explore The Crew&apos;s Nest and save sellers you want
              to visit again.
            </p>
            <Link
              href="/harbor-sellers"
              className="mt-6 inline-block rounded-full border border-amber-300/40 px-6 py-3 font-bold text-amber-200 hover:bg-amber-300 hover:text-slate-950"
            >
              Explore The Crew&apos;s Nest
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {sellers.map((seller) => (
              <article
                key={seller.id}
                className="rounded-3xl border border-amber-300/20 bg-white/[0.05] p-7 shadow-xl"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">
                  Saved Harbor Merchant
                </p>

                <h2 className="mt-3 font-serif text-2xl font-bold text-amber-200">
                  {seller.name}
                </h2>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/harbor-sellers/${seller.id}`}
                    className="rounded-full bg-amber-300 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-200"
                  >
                    Visit Storefront
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeSeller(seller.id)}
                    disabled={removingId !== null}
                    className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold text-stone-200 hover:border-red-300/50 hover:text-red-200 disabled:opacity-50"
                  >
                    {removingId === seller.id
                      ? "Removing..."
                      : "Remove Seller"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
