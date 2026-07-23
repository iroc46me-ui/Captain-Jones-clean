"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  title: string;
  slug: string;
  price: string;
  seller: string;
  orderId: string;
  status: string;
  orderedAt: string;
};

const ORDERS_KEY = "davey-jones-orders";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const storedOrders = window.localStorage.getItem(ORDERS_KEY);

      if (!storedOrders) {
        setOrders([]);
        return;
      }

      const parsedOrders = JSON.parse(storedOrders);

      setOrders(Array.isArray(parsedOrders) ? parsedOrders : []);
    } catch {
      setOrders([]);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-amber-400/20 bg-gradient-to-r from-[#071116] via-[#10242c] to-[#071116]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-6 py-7 sm:px-10 md:flex-row md:items-end lg:px-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Captain&apos;s Locker
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
              My Orders
            </h1>

            <p className="mt-3 text-stone-300">
              Review treasures you have claimed through Captain&apos;s Checkout.
            </p>
          </div>

          <a
            href="/captain's-locker"
            className="rounded-full border border-white/20 px-6 py-3 text-center font-bold transition hover:border-amber-300/60 hover:text-amber-200"
          >
            Return to Captain&apos;s Locker
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <article
                key={`${order.orderId}-${index}`}
                className="flex flex-col justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6 md:flex-row md:items-center"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                    {order.status || "Order Confirmed"}
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-stone-100">
                    {order.title}
                  </h2>

                  <p className="mt-2 text-sm text-stone-400">
                    Seller: {order.seller}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    Order: {order.orderId}
                  </p>
                </div>

                <div className="flex flex-col items-start gap-3 md:items-end">
                  <p className="text-3xl font-black text-amber-200">
                    {order.price}
                  </p>

                  <Link
                    href={`/listing/${order.slug}`}
                    className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-bold text-cyan-100"
                  >
                    View Treasure
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
            <p className="font-serif text-2xl">No orders yet</p>

            <p className="mt-3 text-stone-500">
              Completed test purchases will appear here.
            </p>

            <Link
              href="/treasure-deck"
              className="mt-6 inline-block rounded-full bg-amber-300 px-7 py-3 font-bold text-slate-950 transition hover:bg-amber-200"
            >
              Explore the Treasure Deck
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}