
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
      className="relative min-h-screen overflow-hidden bg-cover bg-center bg-no-repeat px-3 py-8 text-white sm:px-6 md:py-16"
      style={{
        backgroundImage:
          "url('/marketplace-art/fresh-arrivals-harbor-bg.png')",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex justify-end">
          <Link
            href="/"
            className="rounded-full border border-amber-300/50 bg-slate-950/60 px-4 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-300 hover:text-slate-950"
          >
            ⚓ Return Home
          </Link>
        </div>

        <h1 className="mt-4 text-3xl font-black leading-tight text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.95)] sm:text-4xl">
          Fresh Arrivals at the Harbor
        </h1>

        <div className="fresh-arrivals-cards mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.slug}
              className="min-w-0 rounded-2xl border border-amber-300/25 bg-slate-950/35 p-3 shadow-lg transition hover:-translate-y-1 hover:border-amber-300/60 sm:p-4"
            >
              <Link
                href={`/listing/${item.slug}`}
                className="block"
              >
                <div className="mb-3 flex aspect-[3/4] items-center justify-center overflow-hidden rounded-xl bg-slate-900/65 text-5xl">
                  <span aria-hidden="true">⚓</span>
                </div>

                <p className="text-[10px] font-black uppercase leading-tight tracking-wide text-amber-300 sm:text-xs">
                  {item.tag}
                </p>

                <h2 className="mt-2 break-words text-base font-black leading-snug text-white sm:text-lg">
                  {item.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-100 sm:text-sm">
                  {item.description}
                </p>

                <p className="mt-3 text-xl font-black text-amber-300 sm:text-2xl">
                  {item.price}
                </p>
              </Link>

              <Link
                href={`/listing/${item.slug}`}
                className="mt-3 inline-flex rounded-full border border-amber-300/50 bg-slate-950/60 px-3 py-1.5 text-xs font-bold text-amber-100 transition hover:bg-amber-300 hover:text-slate-950"
              >
                Open Chest
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
