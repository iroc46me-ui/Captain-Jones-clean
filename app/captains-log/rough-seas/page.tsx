"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function RoughSeasPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setSubmitted(false);

  const formElement = event.currentTarget;
  const form = new FormData(formElement);

  const report = {
    name: form.get("name"),
    email: form.get("email"),
    page: form.get("page"),
    device: form.get("device"),
    details: form.get("details"),
  };

  try {
    const response = await fetch("/api/rough-seas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      throw new Error("Report could not be sent.");
    }

    formElement.reset();
    setSubmitted(true);
  } catch (error) {
    console.error(error);
    alert("Your report could not be sent. Please try again.");
  }
}

  return (
    <main
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: "url('/chart-course-construction.png')",
      }}
    >
      <div className="min-h-screen bg-gradient-to-r from-slate-950/55 via-slate-950/30 to-transparent">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:px-16">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-red-300">
            Captain&apos;s Log
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Report Rough Seas
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-amber-50 sm:text-xl">
            Found something aboard the Harbor that doesn&apos;t work quite
            right? Tell the Captain what happened so we can make repairs.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 max-w-3xl space-y-6 rounded-3xl border border-white/15 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block font-bold text-amber-300"
              >
                Your Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-300"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-bold text-amber-300"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-300"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="page"
                className="mb-2 block font-bold text-red-200"
              >
                Where Did You Find the Problem?
              </label>

              <input
                id="page"
                name="page"
                type="text"
                required
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-300"
                placeholder="Example: Treasure Deck, Captain's Log, seller page..."
              />
            </div>

            <div>
              <label
                htmlFor="device"
                className="mb-2 block font-bold text-red-200"
              >
                What Were You Using?
              </label>

              <select
                id="device"
                name="device"
                required
                className="w-full rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-red-300"
              >
                <option value="">Choose one...</option>
                <option value="desktop">Desktop computer</option>
                <option value="laptop">Laptop</option>
                <option value="phone">Phone</option>
                <option value="tablet">Tablet</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="details"
                className="mb-2 block font-bold text-red-200"
              >
                Tell the Captain What Happened
              </label>

              <textarea
                id="details"
                name="details"
                required
                rows={7}
                className="w-full resize-y rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-300"
                placeholder="What did you click, what did you expect, and what happened instead?"
              />
            </div>

            <button
              type="submit"
              className="rounded-full border border-red-300/60 bg-red-300 px-8 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-red-200"
            >
              Send Rough Seas Report
            </button>

            {submitted && (
              <p className="text-lg font-semibold text-amber-300">
                Report entered in the Captain&apos;s Log. Thank you for helping
                keep the Harbor seaworthy.
              </p>
            )}
          </form>

          <div className="mt-12 flex flex-wrap gap-4 pb-16">
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