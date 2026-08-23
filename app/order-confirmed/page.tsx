"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Order = {
  title: string;
  slug: string;
  price: string;
  seller: string;
  orderId: string;
  status: string;
  orderedAt: string;
  feePercent?: string;
  harborFeeInCents?: string;
  sellerAmountInCents?: string;
  transferGroup?: string;
};
const ORDERS_KEY = "davey-jones-orders";
const LAST_ORDER_KEY = "davey-jones-last-order";
function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!sessionId) {
        setErrorMessage("No Stripe checkout session was provided.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.ok || !data.order) {
          setErrorMessage(
            data.error || "Unable to load the completed order."
          );
          setIsLoading(false);
          return;
        }

       const confirmedOrder = data.order as Order;

setOrder(confirmedOrder);

try {
  const existingOrders = JSON.parse(
    localStorage.getItem(ORDERS_KEY) || "[]"
  ) as Order[];

  const alreadySaved = existingOrders.some(
    (existingOrder) =>
      existingOrder.orderId === confirmedOrder.orderId
  );

  if (!alreadySaved) {
    const updatedOrders = [
      confirmedOrder,
      ...existingOrders,
    ];

    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify(updatedOrders)
    );
  }

  localStorage.setItem(
    LAST_ORDER_KEY,
    JSON.stringify(confirmedOrder)
  );
} catch (storageError) {
  console.error(
    "Unable to save confirmed Stripe order:",
    storageError
  );
}
      } catch (error) {
        console.error("Unable to load completed order:", error);
        setErrorMessage("Unable to load the completed order.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrder();
  }, [sessionId]);

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

        {isLoading ? (
          <p className="mt-5 text-stone-400">
            Confirming your Stripe payment...
          </p>
        ) : order ? (
          <>
            <p className="mt-5 text-xl font-semibold">
              {order.title}
            </p>

            <p className="mt-2 text-3xl font-black text-amber-200">
              {order.price}
            </p>

            <p className="mt-4 text-stone-400">
              Order number: {order.orderId}
            </p>

            <p className="mt-1 text-stone-400">
              Seller: {order.seller}
            </p>

            <p className="mt-3 text-sm text-emerald-300">
              ✓ Stripe payment confirmed
            </p>
          </>
        ) : (
          <p className="mt-5 text-rose-300">
            {errorMessage || "The completed order could not be loaded."}
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
          This is a Stripe Sandbox test purchase. No live money was collected.
        </p>
      </section>
    </main>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#071116] text-stone-300">
          Confirming treasure...
        </main>
      }
    >
      <OrderConfirmedContent />
    </Suspense>
  );
}