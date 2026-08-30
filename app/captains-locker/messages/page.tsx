"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BuyerInquiry = {
  id: string;
  buyerName: string;
  status: string;
  createdAt: string;
  listingTitle: string;
  listingSlug: string;
  seller: string;
  lastMessage?: string | null;
};

export default function CaptainsLockerMessagesPage() {
  const [inquiries, setInquiries] = useState<BuyerInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          "/api/harbor-inquiries?scope=buyer",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Your Harbor messages could not be loaded."
          );
        }

        setInquiries(data.inquiries || []);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Your Harbor messages could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, []);

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-cyan-300/20 bg-gradient-to-r from-[#071116] via-[#10242c] to-[#071116]">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Captain&apos;s Locker
          </p>

          <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
            Harbor Messages
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-stone-300">
            Your conversations with Harbor sellers stay here with your account.
          </p>

          <Link
            href="/captains-locker"
            className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
          >
            Return to Captain&apos;s Locker
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8 sm:px-10 lg:px-16">
        {loading && (
          <p className="text-cyan-200">
            Loading your Harbor messages...
          </p>
        )}

        {loadError && (
          <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-5 py-4 text-red-200">
            {loadError}
          </div>
        )}

        {!loading && !loadError && inquiries.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center">
            <p className="text-4xl">⚓</p>

            <h2 className="mt-4 font-serif text-2xl text-amber-200">
              No Harbor Conversations Yet
            </h2>

            <p className="mt-2 text-stone-400">
              Questions you send to sellers will appear here.
            </p>

            <Link
              href="/treasure-deck"
              className="mt-6 inline-flex rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950"
            >
              Explore the Treasure Deck
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <article
              key={inquiry.id}
              className="rounded-3xl border border-cyan-300/20 bg-white/[0.04] p-6"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                    {inquiry.status}
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-amber-200">
                    {inquiry.listingTitle}
                  </h2>

                  <p className="mt-2 text-sm text-stone-400">
                    Seller: {inquiry.seller}
                  </p>

                  <p className="mt-4 max-w-2xl leading-7 text-stone-200">
                    {inquiry.lastMessage ||
                      "Open this conversation to view your messages."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/listing/${inquiry.listingSlug}`}
                    className="rounded-full border border-white/20 px-4 py-2 text-sm font-bold transition hover:bg-white/10"
                  >
                    View Listing
                  </Link>

                  <Link
                    href={`/captains-locker/messages/${inquiry.id}`}
                    className="rounded-full bg-amber-300 px-4 py-2 text-sm font-bold text-slate-950"
                  >
                    Open Conversation
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}