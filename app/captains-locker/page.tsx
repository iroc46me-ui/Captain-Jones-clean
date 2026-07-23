"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type HarborWatchItem = {
  title: string;
  slug: string;
  price: string;
  category?: string;
  seller?: string;
};

type OrderItem = {
  title: string;
  price: string;
  seller?: string;
  status?: string;
};

const HARBOR_WATCH_KEY = "davey-jones-harbor-watch";
const ORDERS_KEY = "davey-jones-orders";

export default function CaptainsLockerPage() {
  const [watchedItems, setWatchedItems] = useState<HarborWatchItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedWatch = JSON.parse(
        localStorage.getItem(HARBOR_WATCH_KEY) || "[]"
      ) as HarborWatchItem[];

      const savedOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
      ) as OrderItem[];

      setWatchedItems(savedWatch);
      setOrders(savedOrders);
    } catch {
      setWatchedItems([]);
      setOrders([]);
    }

    setIsReady(true);
  }, []);

  const lockerStats = [
    {
      label: "Treasures Under Watch",
      value: isReady ? watchedItems.length : "—",
    },
    {
      label: "Orders",
      value: isReady ? orders.length : "—",
    },
    {
      label: "Unread Messages",
      value: 0,
    },
    {
      label: "Saved Sellers",
      value: 0,
    },
  ];

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-amber-400/20 bg-gradient-to-r from-[#071116] via-[#10242c] to-[#071116]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-7 sm:px-10 md:flex-row md:items-end lg:px-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Davey Jones Junk-N-Treasure
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
              Captain&apos;s Locker
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Your personal harbor for watched treasures, purchases, messages
              and account details.
            </p>
          </div>

          <Link
            href="/treasure-deck"
            className="inline-flex w-fit rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-200"
          >
            Explore the Treasure Deck
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {lockerStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
            >
              <p className="text-sm text-stone-400">{stat.label}</p>

              <p className="mt-2 text-3xl font-black text-amber-200">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-cyan-300/20 bg-white/[0.04] p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Harbor Watch
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Treasures Under Watch
                </h2>
              </div>

              <Link
                href="/harbor-watch"
                className="w-fit rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
              >
                Open Harbor Watch
              </Link>
            </div>

            <div className="mt-6 space-y-3">
              {watchedItems.length > 0 ? (
                watchedItems.slice(0, 3).map((item, index) => (
                  <Link
                    key={`${item.slug}-${index}`}
                    href={`/listing/${item.slug}`}
                    className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 transition hover:border-amber-300/40 sm:flex-row sm:items-center"
                  >
                    <div>
                      <p className="font-bold">{item.title}</p>

                      <p className="mt-1 text-sm text-stone-400">
                        {item.seller
                          ? `Seller: ${item.seller}`
                          : item.category || "Harbor Watch item"}
                      </p>
                    </div>

                    <p className="text-xl font-black text-amber-200">
                      {item.price}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/30 px-6 py-10 text-center">
                  <p className="font-serif text-xl text-stone-200">
                    The watch is quiet
                  </p>

                  <p className="mt-2 text-sm text-stone-500">
                    Treasures saved with the Harbor Watch diver will appear
                    here.
                  </p>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-transparent p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
                Orders
              </p>

              <h2 className="mt-2 font-serif text-2xl">
                Purchase History
              </h2>

              {orders.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {orders.slice(0, 3).map((order, index) => (
                    <div
                      key={`${order.title}-${index}`}
                      className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-bold">{order.title}</p>

                        <p className="font-black text-amber-200">
                          {order.price}
                        </p>
                      </div>

                      <p className="mt-1 text-sm text-stone-500">
                        {order.status || "Order received"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 leading-7 text-stone-400">
                  Completed test purchases will appear here once the order
                  confirmation pathway is connected.
                </p>
              )}

              <Link
                href="/captains-locker/orders"
                className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
              >
                View All Orders
              </Link>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Locker Tools
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href="/captains-locker/messages"
                  className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 font-bold transition hover:border-cyan-300/40"
                >
                  Harbor Messages
                </Link>

                <Link
                  href="/captains-locker/profile"
                  className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 font-bold transition hover:border-cyan-300/40"
                >
                  Account & Profile
                </Link>

                <Link
                  href="/"
                  className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 font-bold transition hover:border-cyan-300/40"
                >
                  Return Home
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}