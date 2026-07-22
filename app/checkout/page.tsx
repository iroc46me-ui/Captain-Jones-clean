"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type CheckoutListing = {
  title: string;
  slug: string;
  price: string;
  seller: string;
  category?: string;
  shipping?: string;
};

type Order = CheckoutListing & {
  orderId: string;
  status: string;
  orderedAt: string;
};

const PUBLISHED_LISTINGS_KEY = "davey-jones-published-listings";
const ORDERS_KEY = "davey-jones-orders";
const LAST_ORDER_KEY = "davey-jones-last-order";

const sampleListings: CheckoutListing[] = [
  {
    title: "Vintage Brass Ship Lantern",
    slug: "vintage-brass-ship-lantern",
    price: "$68",
    seller: "Old Harbor Finds",
    category: "Antiques",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "Desert Nugget Digger",
    slug: "desert-nugget-digger",
    price: "$75",
    seller: "Davey's Workshop",
    category: "Gold & Prospecting",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "Old Coin & Relic Lot",
    slug: "old-coin-relic-lot",
    price: "$42",
    seller: "Relic Rider",
    category: "Collectibles",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "RV Parts Mystery Box",
    slug: "rv-parts-mystery-box",
    price: "$35",
    seller: "Road Dog Salvage",
    category: "RV & Auto",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "Prospector's Brass Scale",
    slug: "prospectors-brass-scale",
    price: "$88",
    seller: "Quartzsite Cache",
    category: "Gold & Prospecting",
    shipping: "Buyer Pays Shipping",
  },
  {
    title: "Estate Drawer Oddities",
    slug: "estate-drawer-oddities",
    price: "$29",
    seller: "Second Drawer Co.",
    category: "Estate Finds",
    shipping: "Buyer Pays Shipping",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemSlug = searchParams.get("item");

  const [listing, setListing] = useState<CheckoutListing | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Test Card");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const publishedListings = JSON.parse(
        localStorage.getItem(PUBLISHED_LISTINGS_KEY) || "[]"
      ) as CheckoutListing[];

      const foundListing = [...publishedListings, ...sampleListings].find(
        (item) => item.slug === itemSlug
      );

      setListing(foundListing || null);
    } catch {
      const sampleListing = sampleListings.find(
        (item) => item.slug === itemSlug
      );

      setListing(sampleListing || null);
    }

    setIsReady(true);
  }, [itemSlug]);

  function completeTestPurchase() {
    if (!listing) return;

    const order: Order = {
      ...listing,
      orderId: `DJ-${Date.now()}`,
      status: "Order Confirmed",
      orderedAt: new Date().toISOString(),
    };

    try {
      const existingOrders = JSON.parse(
        localStorage.getItem(ORDERS_KEY) || "[]"
      ) as Order[];

      const updatedOrders = [order, ...existingOrders];

      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify(updatedOrders)
      );

      localStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify(order)
      );

      window.dispatchEvent(
        new CustomEvent("orders-updated")
      );

      router.push("/order-confirmed");
    } catch {
      alert("The test order could not be saved.");
    }
  }

  if (!isReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071116] text-stone-300">
        Preparing Captain&apos;s Checkout...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-amber-400/20 bg-gradient-to-r from-[#071116] via-[#11232b] to-[#071116]">
        <div className="mx-auto max-w-5xl px-6 py-6 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Davey Jones Junk-N-Treasure
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200">
            Captain&apos;s Checkout
          </h1>

          <p className="mt-2 text-stone-300">
            Review your treasure before completing this test purchase.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-5 px-6 py-7 sm:px-10 lg:grid-cols-[1fr_0.85fr] lg:px-16">
        <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Order Summary
          </p>

          {listing ? (
            <>
              <h2 className="mt-3 font-serif text-3xl">
                {listing.title}
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-stone-400">Seller</span>
                  <span className="font-semibold">{listing.seller}</span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-stone-400">Category</span>
                  <span className="font-semibold">
                    {listing.category || "Treasure"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-3">
                  <span className="text-stone-400">Delivery</span>
                  <span className="font-semibold">
                    {listing.shipping || "Calculated later"}
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-950/70 px-5 py-4">
                <span className="font-semibold text-stone-300">
                  Estimated total
                </span>

                <span className="text-3xl font-black text-amber-200">
                  {listing.price}
                </span>
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-5">
              <p className="font-semibold text-amber-100">
                No treasure was selected.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-cyan-300/20 bg-gradient-to-b from-cyan-950/70 to-slate-950 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Test Payment
          </p>

          <h2 className="mt-2 font-serif text-2xl">
            Choose a payment method
          </h2>

          <div className="mt-5 space-y-3">
            {[
              "Test Card",
              "Test PayPal",
              "Test Apple Pay",
            ].map((method) => (
              <label
                key={method}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                />

                <span className="font-semibold">{method}</span>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={completeTestPurchase}
            disabled={!listing}
            className="mt-6 w-full rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Complete Test Purchase
          </button>

          <p className="mt-3 text-center text-xs leading-5 text-stone-500">
            No real payment will be collected.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/treasure-deck"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
            >
              Return to Treasure Deck
            </Link>

            {itemSlug && (
              <Link
                href={`/listing/${itemSlug}`}
                className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-bold text-cyan-100"
              >
                Return to Listing
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}