"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type HarborWatchItem = {
  title: string;
  slug: string;
  price: string;
  category?: string;
  seller?: string;
};

const STORAGE_KEY = "davey-jones-harbor-watch";

export default function HarborWatchPage() {
  const [watchedItems, setWatchedItems] = useState<HarborWatchItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    function loadWatchedItems() {
      try {
        const savedItems = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        ) as HarborWatchItem[];

        setWatchedItems(savedItems);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        setWatchedItems([]);
      }

      setIsReady(true);
    }

    loadWatchedItems();

    window.addEventListener(
      "harbor-watch-updated",
      loadWatchedItems
    );

    return () => {
      window.removeEventListener(
        "harbor-watch-updated",
        loadWatchedItems
      );
    };
  }, []);

  function removeFromHarborWatch(slug: string) {
    const updatedItems = watchedItems.filter(
      (item) => item.slug !== slug
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedItems)
    );

    setWatchedItems(updatedItems);

    window.dispatchEvent(
      new CustomEvent("harbor-watch-updated")
    );
  }

  return (
    <main className="min-h-screen bg-[#071116] text-[#eee5d2]">
      <section className="relative overflow-hidden border-b border-amber-500/20 bg-gradient-to-r from-[#081720] via-[#0a1d27] to-[#071116]">
  {/* Subtle atmospheric background */}
  <div className="pointer-events-none absolute inset-0">
    <div className="absolute -left-24 top-8 h-56 w-56 rounded-full bg-cyan-400/5 blur-3xl" />
    <div className="absolute right-12 top-8 h-52 w-52 rounded-full bg-amber-300/5 blur-3xl" />
    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.025] to-transparent" />
  </div>

  <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-6 px-6 py-8 md:grid-cols-[1.4fr_0.6fr] md:px-10 lg:px-16">
    {/* Live page wording */}
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-400 sm:text-sm">
        Davey Jones Junk-N-Treasure
      </p>

      <h1 className="mt-2 font-serif text-4xl font-semibold tracking-wide text-amber-200 sm:text-5xl lg:text-6xl">
        Harbor Watch
      </h1>

      <p className="mt-4 max-w-xl text-base leading-7 text-stone-200 sm:text-lg">
        The harbor crew is keeping an eye on these treasures until
        you&apos;re ready to return.
      </p>

      <Link
        href="/"
        className="mt-6 inline-flex rounded-full border border-amber-400/60 bg-amber-400/10 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:-translate-y-0.5 hover:bg-amber-400/20"
      >
        Return to the Marketplace
      </Link>
    </div>

    {/* Harbor Watch diver */}
    <div className="relative mx-auto hidden h-[245px] w-full max-w-[220px] md:block">
      <div className="absolute inset-6 rounded-full bg-amber-300/5 blur-3xl" />

      <Image
        src="/harbor-watch-diver.png"
        alt="Historic Harbor Watch deep-sea diver"
        fill
        priority
        className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.65)]"
        sizes="220px"
      />
    </div>
  </div>
</section>

      <section className="mx-auto max-w-7xl px-6 pb-10 pt-7 sm:px-10 lg:px-16">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-amber-500/20 pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-500">
              Your Collection
            </p>

              <h2 className="mt-1 font-serif text-2xl text-stone-100 sm:text-3xl">
              Treasures Under Watch
            </h2>
          </div>

          <p className="text-sm text-stone-400">
            {watchedItems.length}{" "}
            {watchedItems.length === 1 ? "treasure" : "treasures"} under watch
          </p>
        </div>

        {!isReady ? (
          <div className="rounded-3xl border border-amber-500/20 bg-white/[0.04] px-6 py-16 text-center">
            <p className="text-stone-400">
              The harbor crew is checking the watch list...
            </p>
          </div>
        ) : watchedItems.length === 0 ? (
          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-white/[0.05] to-transparent px-6 py-16 text-center shadow-2xl shadow-black/20 sm:px-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 text-4xl">
              ⚓
            </div>

            <h3 className="mt-7 font-serif text-2xl text-amber-200">
              The Watch Is Quiet
            </h3>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-stone-400">
              You have not placed any treasures under Harbor Watch yet.
              Return to the marketplace and ask the diver to watch an item
              for you.
            </p>

            <Link
              href="/"
              className="mt-8 inline-flex rounded-full bg-amber-400 px-7 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300"
            >
              Explore the Treasure Deck
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {watchedItems.map((item) => (
              <article
                key={item.slug}
                className="rounded-[2rem] border border-amber-400/20 bg-white/[0.05] p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-amber-300/50"
              >
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-400">
                  {item.category || "Treasure"}
                </p>

                <h3 className="mt-3 font-serif text-2xl text-stone-100">
                  {item.title}
                </h3>

                <p className="mt-4 text-2xl font-bold text-amber-300">
                  {item.price}
                </p>

                {item.seller && (
                  <p className="mt-3 text-sm text-stone-400">
                    Seller: {item.seller}
                  </p>
                )}

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/item-${item.slug}`}
                    className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
                  >
                    View Treasure
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeFromHarborWatch(item.slug)}
                    className="rounded-full border border-stone-500 px-5 py-2.5 text-sm font-semibold text-stone-300 transition hover:border-amber-300 hover:text-amber-200"
                  >
                    Remove from Watch
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}