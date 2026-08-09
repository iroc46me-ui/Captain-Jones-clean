"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function SuggestIdeaPage() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setSubmitted(false);

  const formElement = event.currentTarget;
  const form = new FormData(formElement);

  const idea = {
    name: form.get("name"),
    email: form.get("email"),
    title: form.get("title"),
    details: form.get("details"),
  };

  try {
    const response = await fetch("/api/suggest-idea", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idea),
    });

    if (!response.ok) {
      throw new Error("Message could not be sent.");
    }

    formElement.reset();
    setSubmitted(true);
  } catch (error) {
    console.error(error);
    alert("Your idea could not be sent. Please try again.");
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
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">
            Captain&apos;s Log
          </p>

          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Suggest an Idea
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-amber-50 sm:text-xl">
            Have an idea that could make Davey Jones Junk-N-Treasure better?
            Send it to the Captain. Big ideas, small improvements, strange
            notions, and things we haven&apos;t thought of yet are all welcome.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-12 max-w-3xl space-y-6 rounded-3xl border border-white/15 bg-slate-950/70 p-6 shadow-2xl backdrop-blur-sm sm:p-8"
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
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                placeholder="Captain, sailor, seller, buyer..."
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
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="mb-2 block font-bold text-cyan-300"
              >
                Name Your Idea
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                placeholder="Example: Treasure alerts for nearby items"
              />
            </div>

            <div>
              <label
                htmlFor="details"
                className="mb-2 block font-bold text-cyan-300"
              >
                Tell the Captain More
              </label>

              <textarea
                id="details"
                name="details"
                required
                rows={7}
                className="w-full resize-y rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-cyan-300"
                placeholder="What should we build, change, improve, or add?"
              />
            </div>

            <button
              type="submit"
              className="rounded-full border border-cyan-300/60 bg-cyan-300 px-8 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200"
            >
              Log My Idea
            </button>

            {submitted && (
              <p className="text-lg font-semibold text-amber-300">
                Your idea has been entered in the Captain&apos;s Log.
                Thank you for helping shape the Harbor.
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