"use client";
import { useEffect, useState } from "react";
import { sellers } from "../../lib/sellers";
type SellerPaymentStatus = {
  connected: boolean;
  readyForPayouts: boolean;
  transferStatus: string | null;
  hasCurrentRequirements: boolean;
};
export default function HarborSellersPage() {
  const [paymentStatuses, setPaymentStatuses] = useState<
  Record<string, SellerPaymentStatus>
>({});


    async function startStripeOnboarding(sellerId: string) {
  try {
    const accountResponse = await fetch(
      "/api/create-connected-account",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerId }),
      }
    );

    const accountData = await accountResponse.json();

    if (!accountResponse.ok || !accountData.accountId) {
      throw new Error(
        accountData.error
          ? JSON.stringify(accountData.error)
          : "Unable to create or find Stripe account"
      );
    }

    const linkResponse = await fetch("/api/create-account-link", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountId: accountData.accountId,
      }),
    });

    const linkData = await linkResponse.json();

    if (!linkResponse.ok || !linkData.url) {
      throw new Error(
        linkData.error
          ? JSON.stringify(linkData.error)
          : "Unable to create Stripe onboarding link"
      );
    }

    window.location.href = linkData.url;
  } catch (error) {
    console.error("Unable to start Stripe onboarding:", error);
    alert("Unable to start Stripe onboarding. Check the console for details.");
  }
}
useEffect(() => {
  async function loadPaymentStatuses() {
    for (const seller of sellers) {
      

      try {
        const response = await fetch(
  `/api/seller-payment-status?sellerId=${seller.id}`,
  { cache: "no-store" }
);

        const data = await response.json();

        if (response.ok && data.ok) {
          setPaymentStatuses((current) => ({
            ...current,
            [seller.name]: {
              connected: data.connected,
              readyForPayouts: data.readyForPayouts,
              transferStatus: data.transferStatus,
              hasCurrentRequirements: data.hasCurrentRequirements,
            },
          }));
        }
      } catch (error) {
        console.error(
          `Could not check Stripe status for ${seller.name}:`,
          error
        );
      }
    }
  }

  loadPaymentStatuses();
}, []);
  return (
    <main
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-fixed bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/harbor-sellers-background.png')",
      }}  
    >
      <div className="min-h-screen bg-slate-950/15">
        <section className="mx-auto max-w-7xl px-6 py-16">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-amber-300">
            Harbor Sellers
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
            Meet the Harbor Sellers
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-200">
            Trusted sellers, unusual treasures, and independent storefronts
            from around the Harbor.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {sellers.map((seller) => (
              <article
                key={seller.name}
                className="rounded-[2rem] border border-amber-300/30 bg-slate-950/55 p-8 shadow-2xl backdrop-blur-sm"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-amber-300/20 bg-black/40 text-5xl">
                    {seller.icon}
                  </div>

                  <div>
                    <h2 className="text-3xl font-black text-amber-200">
                      {seller.name}
                    </h2>

                    <a
                      href={`#${seller.name
                        .replaceAll(" ", "-")
                        .replaceAll("'", "")
                        .toLowerCase()}`}
                      className="mt-4 inline-block rounded-full border border-amber-300/40 px-5 py-2 font-black text-amber-200 transition hover:bg-amber-300 hover:text-slate-950"
                    >
                      Visit Seller Harbor
                    </a>
                    {!paymentStatuses[seller.name] ? (
  <p className="mt-4 text-sm font-bold text-slate-400">
    Checking Stripe status...
  </p>
) : paymentStatuses[seller.name].readyForPayouts ? (
  <p className="mt-4 inline-block rounded-full border border-emerald-300/40 bg-emerald-300/10 px-4 py-2 text-sm font-black text-emerald-200">
    ✓ Stripe Verified — Ready for Payouts
  </p>
) : paymentStatuses[seller.name].connected ? (
  <button
    type="button"
    onClick={() => startStripeOnboarding(seller.id)}
    className="mt-4 inline-block rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-black text-amber-200 transition hover:bg-amber-300 hover:text-slate-950"
  >
    Continue Stripe Setup
  </button>
) : (
  <button
    type="button"
    onClick={() => startStripeOnboarding(seller.id)}
    className="mt-4 inline-block rounded-full border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-black text-amber-200 transition hover:bg-amber-300 hover:text-slate-950"
  >
    Connect Stripe
  </button>
)}
                  </div>
                </div>

                <div className="mt-7 space-y-2 text-slate-200">
                  <p>📍 {seller.location}</p>
                  <p>⚒️ {seller.category}</p>
                  <p>⭐ Trusted Harbor Seller</p>
                  <p>📦 Ships Throughout the United States</p>
                  <p>🏴‍☠️ {seller.memberSince}</p>
                  <p>⭐⭐⭐⭐⭐ {seller.rating}</p>
                  <p>⚡ {seller.response}</p>
                  <p>🎯 Specialty: {seller.specialty}</p>
                  <p>Listings: {seller.listings}</p>
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
                        {item.title} — {item.price}
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
            ← Return to Harbor
          </a>
        </section>
      </div>
    </main>
  );
}