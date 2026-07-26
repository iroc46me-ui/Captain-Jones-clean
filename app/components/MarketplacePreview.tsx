import Link from "next/link";

export default function MarketplacePreview() {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,125,35,0.12),transparent_55%)]" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-amber-400">
          Marketplace Preview — ACTIVE COMPONENT
        </p>

        <h2 className="mx-auto mt-5 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          From an old cutlass to a gold doubloon, every treasure has a story.
        </h2>

        <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-300">
          Whether it is a family heirloom, a handcrafted creation, a maritime
          relic, a piece of forgotten history, or an unexpected everyday find,
          every item that reaches our harbor has earned its place.
        </p>

        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Some treasures are valuable because of what they are worth. Others
          are priceless because of the journey they have taken and the stories
          they carry.
        </p>

        <p className="mx-auto mt-9 max-w-3xl text-xl font-semibold leading-9 text-amber-100">
          Set sail on your next adventure. Somewhere in the harbor, your next
          treasure is waiting to be discovered.
        </p>

        <Link
          href="/marketplace"
          className="mt-10 inline-flex items-center justify-center rounded-full border border-amber-400/60 bg-amber-500 px-8 py-4 text-lg font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-950"
        >
          Enter the Marketplace
        </Link>
      </div>
    </section>
  );
}