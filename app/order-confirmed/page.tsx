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

const LAST_ORDER_KEY = "davey-jones-last-order";

export default function OrderConfirmedPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(LAST_ORDER_KEY);

      if (savedOrder) {
        setOrder(JSON.parse(savedOrder));
      }
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#071116] px-6 py-10 text-stone-100">
      <section className="w-full max-w-3xl rounded-[2rem] border border-amber-300/30 bg-gradient-to-b from-[#10242c] to-[#071116] p-8 text-center shadow-2xl sm:p-12">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 text-4xl">
          ⚓
        </div>

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
          Davey Jones Junk-N-Treasure
        </p>

        <h1 className="mt-3 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
          Treasure Claimed
        </h1>

        {order ? (
          <>
            <p className="mt-5 text-xl font-semibold">{order.title}</p>

            <p className="mt-2 text-3xl font-black text-amber-200">
              {order.price}
            </p>

            <p className="mt-4 text-stone-400">
              Order number: {order.orderId}
            </p>

            <p className="mt-1 text-stone-400">
              Seller: {order.seller}
            </p>
          </>
        ) : (
          <p className="mt-5 text-stone-400">
            Your test order has been recorded.
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          
           <a
  href="/captains-locker"
  className="rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-200"
>
  Open Captain&apos;s Locker
</a>

<a
  href="/captains-locker/orders"
  className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 font-bold text-cyan-100"
>
  View Orders
</a>
          

          <Link
            href="/treasure-deck"
            className="rounded-full border border-white/20 px-6 py-3 font-bold"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-7 text-xs text-stone-500">
          This is a development test purchase. No money was collected.
        </p>
      </section>
    </main>
  );
}