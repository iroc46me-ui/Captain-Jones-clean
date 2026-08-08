"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type FeatureOption = {
  id: string;
  title: string;
  description: string;
};

const FEATURES: FeatureOption[] = [
  {
    id: "local-pickup-map",
    title: "Local Pickup + Map",
    description:
      "Let buyers find nearby treasures available for local pickup and see pickup areas on a map.",
  },
  {
    id: "video-listings",
    title: "Video Listings",
    description:
      "Allow sellers to add a short video showing an item, its condition, and important details.",
  },
  {
    id: "wanted-ads",
    title: "Wanted Ads",
    description:
      "Let buyers post what they are looking for so Harbor sellers can respond if they have it.",
  },
  {
    id: "shipping-calculator",
    title: "Shipping Calculator",
    description:
      "Estimate shipping cost before checkout based on destination, package size, and weight.",
  },
  {
    id: "make-an-offer",
    title: "Make an Offer",
    description:
      "Allow buyers to make a reasonable offer on selected listings without turning the Harbor into an auction site.",
  },
  {
    id: "follow-a-seller",
    title: "Follow a Seller",
    description:
      "Let buyers follow favorite sellers and easily see when those sellers add new treasure.",
  },
];

const STORAGE_KEY = "davey-jones-feature-vote";

export default function VotePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      ) as string[];

      setSelected(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function toggleFeature(id: string) {
    setSubmitted(false);

    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function submitVote() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    setSubmitted(true);
  }

  return (
    <main
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: "url('/chart-course-construction.png')",
      }}
    >
      <div className="min-h-screen bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-slate-950/35">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-300">
            Captain&apos;s Log
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Vote on Features
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-amber-50 sm:text-xl">
            Help decide what gets built next in Davey Jones Junk-N-Treasure.
            Choose the features you would actually use. The Harbor Crew will
            use this feedback when deciding what moves up the build list.
          </p>

          <p className="mt-4 max-w-3xl text-sm text-slate-300">
            You may choose more than one feature.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {FEATURES.map((feature) => {
              const isSelected = selected.includes(feature.id);

              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => toggleFeature(feature.id)}
                  className={`rounded-2xl border p-6 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-amber-300 bg-amber-300/15 shadow-lg shadow-amber-300/10"
                      : "border-white/15 bg-slate-950/65 hover:-translate-y-1 hover:border-cyan-300/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2
                        className={`text-2xl font-bold ${
                          isSelected ? "text-amber-300" : "text-white"
                        }`}
                      >
                        {feature.title}
                      </h2>

                      <p className="mt-3 text-base leading-7 text-slate-200">
                        {feature.description}
                      </p>
                    </div>

                    <div
                      className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-amber-300 bg-amber-300 text-slate-950"
                          : "border-white/30 bg-black/30"
                      }`}
                    >
                      {isSelected ? "✓" : ""}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-10">
            <button
              type="button"
              onClick={submitVote}
              disabled={selected.length === 0}
              className="rounded-full border border-amber-300/70 bg-amber-400 px-8 py-3 font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit My Vote
            </button>

            {submitted && (
              <p className="mt-5 text-lg font-semibold text-cyan-300">
                Vote saved aboard this device. Thank you for helping chart the
                Harbor&apos;s course.
              </p>
            )}
          </div>

          <div className="mt-16 flex flex-wrap gap-4 pb-16">
            <Link
              href="/captains-log"
              className="rounded-full border border-cyan-300/40 bg-slate-950/70 px-6 py-3 font-bold text-cyan-200 transition hover:border-cyan-200 hover:text-white"
            >
              ← Back to Captain&apos;s Log
            </Link>

            <Link
              href="/"
              className="rounded-full border border-white/30 bg-slate-950/70 px-6 py-3 font-bold text-white transition hover:border-amber-300 hover:text-amber-200"
            >
              ⚓ Return to Harbor
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}