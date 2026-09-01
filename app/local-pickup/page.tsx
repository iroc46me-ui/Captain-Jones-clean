import Link from "next/link";

export default function LocalPickupPage() {
  return (
    <main className="min-h-screen bg-[#050914] text-stone-100">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#030711]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="text-3xl text-cyan-400"
            aria-label="Davey Jones Junk-N-Treasure Home"
          >
            ⚓
          </Link>

          <div className="flex flex-wrap items-center gap-5 text-sm font-bold">
            <Link
              href="/treasure-deck"
              className="transition hover:text-amber-300"
            >
              Treasure Deck
            </Link>

            <Link
              href="/captains-locker"
              className="transition hover:text-amber-300"
            >
              Captain&apos;s Locker
            </Link>

            <Link
              href="/about"
              className="transition hover:text-amber-300"
            >
              About
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-amber-300/20 bg-gradient-to-b from-cyan-950/50 via-[#071116] to-[#050914]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-16">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
            Harbor Trading
          </p>

          <h1 className="mt-4 font-serif text-5xl font-bold text-white sm:text-6xl">
            Local Pickup
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-300">
            Some treasure is too large, too heavy, too unusual, or simply
            better exchanged face-to-face. Local Pickup gives Harbor buyers
            and sellers another way to complete the voyage.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-10 lg:px-16">
        <div className="grid gap-6 md:grid-cols-2">
          <InfoCard
            icon="🧭"
            title="Find Nearby Treasure"
            text="Local Pickup listings are intended for items that buyers and sellers can arrange to exchange in person rather than ship."
          />

          <InfoCard
            icon="⚓"
            title="Keep Communication in Harbor"
            text="Use Harbor Messages to ask questions and discuss the item. Keeping marketplace communication together creates a clearer record for both sides."
          />

          <InfoCard
            icon="🔎"
            title="Read the Listing Carefully"
            text="Check the item's description, condition, pickup information, measurements, and seller notes before committing to a purchase."
          />

          <InfoCard
            icon="🤝"
            title="Arrange Pickup Responsibly"
            text="Buyer and seller are responsible for agreeing on a practical pickup arrangement and following applicable laws and marketplace rules."
          />
        </div>

        {/* IMPORTANT NOTICE */}
        <div className="mt-10 rounded-3xl border border-amber-300/30 bg-amber-300/10 p-7">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-amber-300">
            Harbor Safety
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold text-amber-100">
            Use good judgment when meeting.
          </h2>

          <div className="mt-5 space-y-3 leading-7 text-stone-300">
            <p>
              Meet in a reasonable location appropriate for the item and
              transaction whenever practical.
            </p>

            <p>
              Do not ignore warning signs, unusual payment requests, pressure,
              or major differences between the listing and the actual item.
            </p>

            <p>
              Davey Jones Junk-N-Treasure provides the marketplace and
              communication tools, but buyers and sellers remain responsible
              for their personal safety and the physical exchange.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            How It Works
          </p>

          <h2 className="mt-3 font-serif text-3xl font-bold text-white">
            From the Treasure Deck to the dock.
          </h2>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Step number="1" text="Find a Local Pickup treasure." />
            <Step number="2" text="Review the listing and ask questions." />
            <Step number="3" text="Use Harbor communication to coordinate." />
            <Step number="4" text="Complete the pickup responsibly." />
          </div>
        </section>

        {/* ALPHA NOTE */}
        <div className="mt-10 rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-7">
          <h2 className="font-serif text-2xl font-bold text-cyan-100">
            Local Pickup During Harbor Alpha
          </h2>

          <p className="mt-3 leading-7 text-stone-300">
            Local Pickup tools will continue to develop as the marketplace
            grows. More detailed pickup, transaction, and location features may
            be added as Harbor operations expand.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/treasure-deck"
            className="rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:bg-amber-200"
          >
            Explore the Treasure Deck
          </Link>

          <Link
            href="/seller-chest"
            className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 font-bold text-cyan-100 transition hover:bg-cyan-300/20"
          >
            Sell Your Treasure
          </Link>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-7">
      <div className="text-3xl">{icon}</div>

      <h2 className="mt-4 font-serif text-2xl font-bold text-amber-200">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-stone-300">
        {text}
      </p>
    </div>
  );
}

function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/40 bg-amber-300/10 font-black text-amber-200">
        {number}
      </div>

      <p className="mt-4 font-semibold leading-6 text-stone-200">
        {text}
      </p>
    </div>
  );
}