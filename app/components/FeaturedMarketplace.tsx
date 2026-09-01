import Link from "next/link";

type Item = {
  title: string;
  slug: string;
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
    <section
      className="fresh-arrivals-reveal relative min-h-screen overflow-hidden px-6 py-16 text-white"
      style={{
        backgroundImage:
          "url('/marketplace-art/fresh-arrivals-harbor-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      
          <div className="mb-6 flex justify-end">
    <Link
      href="/"
      className="rounded-full border border-amber-300/50 bg-slate-950/60 px-5 py-2.5 text-sm font-bold text-amber-200 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-300 hover:bg-amber-300 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(251,191,36,0.45)]"
    >
      ⚓ Return Home
    </Link>
  </div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          Captain Jones&apos; Featured Discoveries
        </p>

        <h2 className="mt-4 text-4xl font-bold">
          Fresh Arrivals at the Harbor
        </h2>

        <div className="fresh-arrivals-grid mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => (
            <div
              key={item.slug}
              className="rounded-2xl border border-amber-400/20 bg-slate-900/85 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:border-amber-400/50"
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

                <Link
                  href={`/listing/${item.slug}`}
                  className="rounded-full border border-amber-400/50 px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-all duration-300 hover:bg-amber-400 hover:text-slate-900 hover:shadow-[0_0_16px_rgba(251,191,36,0.45)]"
                >
                  Open Chest
                </Link>
              </div>
            </div>
          ))}
        </div>
      
    </section>
  );
}