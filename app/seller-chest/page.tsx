import Link from "next/link";

const sellerStats = [
  { label: "Active Listings", value: "6" },
  { label: "Draft Listings", value: "1" },
  { label: "Sold Items", value: "0" },
  { label: "Harbor Messages", value: "0" },
];

export default function SellerChestPage() {
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
              Manage listings, prepare shipments and keep track of everything
              you&apos;re selling around the harbor.
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
          {sellerStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/[0.05] p-5"
            >
              <p className="text-sm text-stone-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-black text-amber-200">
                {stat.value}
              </p>
            </div>
          ))}
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

            <div className="mt-6 space-y-3">
              {[
                ["Desert Nugget Digger", "$75", "Active"],
                ["Vintage Brass Ship Lantern", "$68", "Active"],
                ["Prospector's Brass Scale", "$88", "Active"],
              ].map(([title, price, status]) => (
                <div
                  key={title}
                  className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 px-5 py-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="font-bold">{title}</p>
                    <p className="mt-1 text-sm text-stone-400">{status}</p>
                  </div>

                  <p className="text-xl font-black text-amber-200">{price}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-transparent p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Shipping Queue
            </p>

            <h2 className="mt-2 font-serif text-2xl">
              No Orders Awaiting Shipment
            </h2>

            <p className="mt-4 leading-7 text-stone-400">
              Sold treasures requiring labels and tracking information will
              appear here.
            </p>

            <Link
              href="/"
              className="mt-7 inline-flex rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
            >
              Return Home
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}