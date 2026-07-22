import Link from "next/link";
import Marketplace from "../components/Marketplace";
export default function TreasureDeckPage() {
  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-cyan-400/20 bg-gradient-to-r from-[#071116] via-[#0a2230] to-[#071116]">
  <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-6 py-5 sm:px-10 md:flex-row md:items-end lg:px-16">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300 sm:text-sm">
        Davey Jones Junk-N-Treasure
      </p>

      <h1 className="mt-1 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
        Treasure Deck
      </h1>

      <p className="mt-2 max-w-2xl text-base leading-7 text-stone-300">
        Browse useful junk, rare finds, honest treasure and unusual
        discoveries from sellers around the harbor.
      </p>
    </div>

    <Link
      href="/"
      className="inline-flex w-fit rounded-full border border-amber-400/60 bg-amber-400/10 px-5 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/20"
    >
      Return Home
    </Link>
  </div>
</section>

      <Marketplace />
    </main>
  );
}