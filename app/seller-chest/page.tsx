"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type DatabaseListing = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  category: string;
  condition?: string | null;
  shipping?: string | null;
  status: string;
  createdAt?: string;
  seller: string;
};
type SellerOrder = {
  id: string;
  amountCents: number;
  harborFeeInCents: number;
  sellerAmountCents: number;
  paymentStatus: string;
  shippingStatus: string;
  shippingCarrier?: string | null;
  trackingNumber?: string | null;
  shippedAt?: string | null;
  createdAt: string;
  listingId: string;
  listingSlug: string;
  listingTitle: string;
};

const SELLER_NAME = "Davey's Workshop";

export default function SellerChestPage() {
    const [listings, setListings] = useState<DatabaseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [harborMessageCount, setHarborMessageCount] = useState(0);
  const [orders, setOrders] = useState<SellerOrder[]>([]);
const [ordersLoading, setOrdersLoading] = useState(true);
const [ordersLoadError, setOrdersLoadError] = useState("");
const [shippingCarrier, setShippingCarrier] = useState<Record<string, string>>({});
const [trackingNumber, setTrackingNumber] = useState<Record<string, string>>({});
const [shippingSaving, setShippingSaving] = useState<string | null>(null);

  useEffect(() => {
    async function loadSellerListings() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/api/listings?includeInactive=true", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Seller inventory could not be loaded."
          );
        }

        const sellerListings = (data.listings || []).filter(
          (listing: DatabaseListing) =>
            listing.seller === SELLER_NAME
        );

        setListings(sellerListings);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Seller inventory could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSellerListings();
  }, []);
   useEffect(() => {
  async function loadHarborMessages() {
    try {
      const response = await fetch(
        "/api/harbor-inquiries?scope=seller",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setHarborMessageCount(data.inquiries?.length || 0);
      }
    } catch {
      setHarborMessageCount(0);
    }
  }

  loadHarborMessages();
}, []);
useEffect(() => {
  async function loadSellerOrders() {
    try {
      setOrdersLoading(true);
      setOrdersLoadError("");

      const response = await fetch("/api/seller-orders", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Seller orders could not be loaded."
        );
      }

      setOrders(data.orders || []);
    } catch (error) {
      setOrdersLoadError(
        error instanceof Error
          ? error.message
          : "Seller orders could not be loaded."
      );
    } finally {
      setOrdersLoading(false);
    }
  }

  loadSellerOrders();
}, []);

async function deactivateListing(slug: string) {
  const confirmed = window.confirm(
    "Deactivate this listing? It will be removed from the Treasure Deck but kept in the database."
  );
 
  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch("/api/listings", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || "The listing could not be deactivated.");
      return;
    }

    setListings((current) =>
      current.map((listing) =>
        listing.slug === slug
          ? { ...listing, status: "INACTIVE" }
          : listing
      )
    );
  } catch {
    alert("The listing could not be deactivated.");
  }
}

  async function reactivateListing(slug: string) {
  try {
    const response = await fetch("/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "reactivate",
        slug,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(
        data.error || "The listing could not be reactivated."
      );
      return;
    }

    setListings((current) =>
      current.map((listing) =>
        listing.slug === slug
          ? { ...listing, status: "ACTIVE" }
          : listing
      )
    );
  } catch {
    alert("The listing could not be reactivated.");
  }
}

  const activeListings = useMemo(
    () =>
      listings.filter(
        (listing) => listing.status === "ACTIVE"
      ),
    [listings]
  );
  const inactiveListings = useMemo(
  () =>
    listings.filter(
      (listing) => listing.status === "INACTIVE"
    ),
  [listings]
);
const soldOrders = useMemo(
  () =>
    orders.filter(
      (order) => order.paymentStatus === "PAID"
    ),
  [orders]
);

const shippingOrders = useMemo(
  () =>
    orders.filter(
      (order) =>
        order.paymentStatus === "PAID" &&
        order.shippingStatus === "AWAITING_SHIPMENT"
    ),
  [orders]
);

  const sellerStats = [
    {
      label: "Active Listings",
      value: String(activeListings.length),
    },
    {
      label: "Draft Listings",
      value: "0",
    },
    {
  label: "Sold Items",
  value: String(soldOrders.length),
},
    {
      label: "Harbor Messages",
      value: String(harborMessageCount) ,
    },
  ];
async function markOrderShipped(orderId: string) {
  const carrier = (shippingCarrier[orderId] || "").trim();
  const tracking = (trackingNumber[orderId] || "").trim();

  if (!carrier) {
    alert("Enter the shipping carrier.");
    return;
  }

  if (!tracking) {
    alert("Enter the tracking number.");
    return;
  }

  try {
    setShippingSaving(orderId);

    const response = await fetch("/api/seller-orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        shippingCarrier: carrier,
        trackingNumber: tracking,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || "The order could not be marked shipped.");
      return;
    }

    setOrders((current) =>
      current.map((order) =>
        order.id === orderId
          ? {
              ...order,
              shippingStatus: "SHIPPED",
              shippingCarrier: carrier,
              trackingNumber: tracking,
              shippedAt:
                data.order?.shippedAt || new Date().toISOString(),
            }
          : order
      )
    );
  } catch {
    alert("The order could not be marked shipped.");
  } finally {
    setShippingSaving(null);  
  }
}
 return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-amber-400/20 bg-gradient-to-r from-[#071116] via-[#10242c] to-[#071116]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-7 sm:px-10 md:flex-row md:items-end lg:px-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Davey Jones Junk-N-Treasure
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
              Seller Chest
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Manage listings, prepare shipments and keep track
              of everything you&apos;re selling around the harbor.
            </p>

            <p className="mt-2 text-sm text-cyan-200">
              Seller: {SELLER_NAME}
            </p>
          </div>

          <Link
            href="/seller-chest/new-listing"
            className="inline-flex w-fit rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-200"
          >
            Create New Listing
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sellerStats.map((stat) =>
  stat.label === "Harbor Messages" ? (
    <Link
      key={stat.label}
      href="/seller-chest/harbor-messages"
      className="rounded-2xl border border-cyan-300/20 bg-white/[0.05] p-5 transition hover:border-cyan-300/50 hover:bg-cyan-300/[0.08]"
    >
      <p className="text-sm text-stone-400">
        {stat.label}
      </p>

      <p className="mt-2 text-3xl font-black text-amber-200">
        {stat.value}
      </p>

      <p className="mt-2 text-xs font-semibold text-cyan-300">
        Open Harbor Inbox →
      </p>
    </Link>
  ) : (
    <div
      key={stat.label}
      className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
    >
      <p className="text-sm text-stone-400">
        {stat.label}
      </p>

      <p className="mt-2 text-3xl font-black text-amber-200">
        {stat.value}
      </p>
    </div>
  )
)}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <section className="rounded-3xl border border-cyan-300/20 bg-white/[0.04] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Inventory
                </p>

                <h2 className="mt-2 font-serif text-2xl">
                  Active Listings
                </h2>
              </div>

              <Link
                href="/treasure-deck"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
              >
                View Treasure Deck
              </Link>
            </div>

            {loading && (
              <p className="mt-6 text-cyan-200">
                Loading seller inventory...
              </p>
            )}

            {loadError && (
              <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-red-200">
                {loadError}
              </div>
            )}

            {!loading &&
              !loadError &&
              activeListings.length === 0 && (
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-8 text-center">
                  <p className="font-serif text-xl text-amber-200">
                    No Active Treasure
                  </p>

                  <p className="mt-2 text-sm text-stone-400">
                    Create a listing and it will appear here.
                  </p>
                </div>
              )}

            <div className="mt-6 space-y-3">
              {activeListings.map((listing) => (
  <div
    key={listing.id}
    className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 sm:flex-row sm:items-center"
  >
    <div>
      <Link
        href={`/listing/${listing.slug}`}
        className="font-bold transition hover:text-amber-200"
      >
        {listing.title}
      </Link>

      <p className="mt-1 text-sm text-stone-400">
        Active · {listing.category}
      </p>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <p className="text-xl font-black text-amber-200">
        ${(listing.priceCents / 100).toFixed(2)}
      </p>

      <Link
        href={`/seller-chest/edit-listing/${listing.slug}`}
        className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
      >
        Edit Listing
      </Link>
      <button
  type="button"
  onClick={() => deactivateListing(listing.slug)}
  className="rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-bold text-amber-100 transition hover:bg-amber-300/20"
>
  Deactivate
</button>
    </div>
  </div>
))}
            </div>
          </section>
{inactiveListings.length > 0 && (
  <section className="rounded-3xl border border-amber-300/20 bg-white/[0.04] p-6">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
        Stored Treasure
      </p>

      <h2 className="mt-2 font-serif text-2xl">
        Inactive Listings
      </h2>

      <p className="mt-2 text-sm text-stone-400">
        These listings are hidden from the Treasure Deck but remain saved.
      </p>
    </div>

    <div className="mt-6 space-y-3">
      {inactiveListings.map((listing) => (
        <div
          key={listing.id}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-bold">{listing.title}</p>

            <p className="mt-1 text-sm text-stone-400">
              Inactive · {listing.category}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xl font-black text-amber-200">
              ${(listing.priceCents / 100).toFixed(2)}
            </p>

            <button
              type="button"
              onClick={() => reactivateListing(listing.slug)}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              Reactivate
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
)}

          <aside className="rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-transparent p-6">
  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
    Shipping Queue
  </p>

  <h2 className="mt-2 font-serif text-2xl">
    {shippingOrders.length === 0
      ? "No Orders Awaiting Shipment"
      : `${shippingOrders.length} ${
          shippingOrders.length === 1 ? "Order" : "Orders"
        } Awaiting Shipment`}
  </h2>

  {ordersLoading && (
    <p className="mt-4 text-cyan-200">
      Loading sold treasures...
    </p>
  )}

  {ordersLoadError && (
    <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      {ordersLoadError}
    </div>
  )}

  {!ordersLoading &&
    !ordersLoadError &&
    shippingOrders.length === 0 && (
      <p className="mt-4 leading-7 text-stone-400">
        Sold treasures requiring labels and tracking
        information will appear here.
      </p>
    )}

  {!ordersLoading &&
    !ordersLoadError &&
    shippingOrders.length > 0 && (
      <div className="mt-5 space-y-3">
        {shippingOrders.map((order) => (
          <div
            key={order.id}
            className="rounded-2xl border border-amber-300/20 bg-slate-950/50 p-4"
          >
            <Link
              href={`/listing/${order.listingSlug}`}
              className="font-bold text-amber-100 transition hover:text-amber-200"
            >
              {order.listingTitle}
            </Link>

            <p className="mt-2 text-xl font-black text-amber-200">
              ${(order.amountCents / 100).toFixed(2)}
            </p>

            <div className="mt-4 space-y-3">
  <select
    value={shippingCarrier[order.id] || ""}
    onChange={(event) =>
      setShippingCarrier((current) => ({
        ...current,
        [order.id]: event.target.value,
      }))
    }
    className="w-full rounded-xl border border-white/15 bg-[#071116] px-3 py-2 text-sm text-stone-100"
  >
    <option value="">Select Carrier</option>
    <option value="USPS">USPS</option>
    <option value="UPS">UPS</option>
    <option value="FedEx">FedEx</option>
    <option value="DHL">DHL</option>
    <option value="Other">Other</option>
  </select>

  <input
    type="text"
    value={trackingNumber[order.id] || ""}
    onChange={(event) =>
      setTrackingNumber((current) => ({
        ...current,
        [order.id]: event.target.value,
      }))
    }
    placeholder="Tracking number"
    className="w-full rounded-xl border border-white/15 bg-[#071116] px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500"
  />

  <button
    type="button"
    onClick={() => markOrderShipped(order.id)}
    disabled={shippingSaving === order.id}
    className="w-full rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {shippingSaving === order.id
      ? "Saving..."
      : "Mark Shipped"}
  </button>
</div>
          </div>
        ))}
      </div>
    )}

  <div className="mt-7 flex flex-wrap gap-3">
  <Link
    href="/captains-locker"
    className="inline-flex rounded-full border border-cyan-300/30 px-5 py-2.5 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/10"
  >
    Captain&apos;s Locker
  </Link>

  <Link
    href="/"
    className="inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
  >
    Return Home
  </Link>
</div>
</aside>
        </div>
      </section>
    </main>
  );
}