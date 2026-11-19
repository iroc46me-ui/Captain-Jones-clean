
"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type LocalOrder = {
  title: string;
  slug: string;
  price: string;
  seller: string;
  orderId: string;
  status: string;
  orderedAt: string;
};

type BuyerOrder = {
  id: string;
  amountCents: number;
  paymentStatus: string;
  shippingStatus: string;
  shippingCarrier: string | null;
  trackingNumber: string | null;
  createdAt: string;
  listingSlug: string;
  listingTitle: string;
  sellerName: string;
};

const ORDERS_KEY = "davey-jones-orders";

function formatPrice(amountCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountCents / 100);
}

export default function OrdersPage() {
  const { isLoaded, isSignedIn } = useAuth();

  const [localOrders, setLocalOrders] = useState<LocalOrder[]>([]);
  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      const parsed = JSON.parse(stored || "[]");

      setLocalOrders(Array.isArray(parsed) ? parsed : []);
    } catch {
      setLocalOrders([]);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setBuyerOrders([]);
      setErrorMessage("");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadBuyerOrders() {
      setLoading(true);
      setErrorMessage("");
      setBuyerOrders([]);

      try {
        const response = await fetch("/api/buyer-orders", {
          cache: "no-store",
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Unable to retrieve your orders."
          );
        }

        if (!controller.signal.aborted) {
          setBuyerOrders(
            Array.isArray(data.orders) ? data.orders : []
          );
        }
      } catch (error) {
        if (controller.signal.aborted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to retrieve your orders."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBuyerOrders();

    return () => controller.abort();
  }, [isLoaded, isSignedIn]);

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

          <Link
            href="/captains-locker"
            className="rounded-full border border-white/20 px-6 py-3 text-center font-bold transition hover:border-amber-300/60 hover:text-amber-200"
          >
            Return to Captain&apos;s Locker
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
        {isLoaded && isSignedIn && (
          <section className="mb-10">
            <h2 className="mb-4 font-serif text-2xl text-amber-200">
              Account Purchase History
            </h2>

            {loading ? (
              <p className="text-stone-400">
                Loading your account orders...
              </p>
            ) : errorMessage ? (
              <p className="text-rose-300" role="alert">
                {errorMessage}
              </p>
            ) : buyerOrders.length > 0 ? (
              <div className="space-y-4">
                {buyerOrders.map((order) => (
                  <article
                    key={order.id}
                    className="flex flex-col justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6 md:flex-row md:items-center"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                        {order.shippingStatus}
                      </p>

                      <h3 className="mt-2 font-serif text-2xl">
                        {order.listingTitle}
                      </h3>

                      <p className="mt-2 text-sm text-stone-400">
                        Seller: {order.sellerName}
                      </p>

                      <p className="mt-1 text-xs text-stone-500">
                        Order: {order.id}
                      </p>

                      {order.trackingNumber && (
                        <p className="mt-2 text-sm text-stone-300">
                          Tracking: {order.shippingCarrier || "Carrier not specified"} — {order.trackingNumber}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <p className="text-3xl font-black text-amber-200">
                        {formatPrice(order.amountCents)}
                      </p>

                      <Link
                        href={`/listing/${order.listingSlug}`}
                        className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-bold text-cyan-100"
                      >
                        View Treasure
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-stone-400">
                No account purchases have been recorded yet.
              </p>
            )}
          </section>
        )}

        <section>
          <h2 className="mb-2 font-serif text-2xl text-amber-200">
            Orders Saved on This Browser
          </h2>

          <p className="mb-5 text-sm text-stone-400">
            These checkout confirmations are stored on this device.
            They may include guest purchases or purchases also shown
            in your account history.
          </p>

          {localOrders.length > 0 ? (
            <div className="space-y-4">
              {localOrders.map((order, index) => (
                <article
                  key={`${order.orderId}-${index}`}
                  className="flex flex-col justify-between gap-5 rounded-3xl border border-white/10 bg-white/[0.05] p-6 md:flex-row md:items-center"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                      {order.status || "Order Confirmed"}
                    </p>

                    <h3 className="mt-2 font-serif text-2xl">
                      {order.title}
                    </h3>

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
              <p className="font-serif text-2xl">
                No browser-saved orders yet
              </p>

              <p className="mt-3 text-stone-500">
                Completed checkout confirmations saved on this device
                will appear here.
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
      </section>
    </main>
  );
}
