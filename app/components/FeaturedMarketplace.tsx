type Item = {
  title: string;
  price: string;
  tag: string;
  seller: string;
  description: string;
};

type FeaturedMarketplaceProps = {
  items: Item[];
};

export default function FeaturedMarketplace({
  items,
}: FeaturedMarketplaceProps) {
  return (
    <section className="bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          Captain Jones' Featured Discoveries
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Fresh Arrivals at the Harbor
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-amber-400/20 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-amber-400/50"
            >
              <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-slate-800 text-5xl">
                ⚓
              </div>

              <p className="text-xs uppercase tracking-widest text-amber-400">
                {item.tag}
              </p>

              <h3 className="mt-2 text-lg font-bold">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                {item.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="font-bold text-amber-300">
                  {item.price}
                </span>

                <button className="rounded-full border border-amber-400/50 px-4 py-2 text-sm hover:bg-amber-400 hover:text-slate-900">
                  View Treasure
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}