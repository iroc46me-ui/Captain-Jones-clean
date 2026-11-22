import Link from "next/link";
import HarborWatchButton from "./HarborWatchButton";

export type TreasureCardItem = {
  title: string;
  slug: string;
  image?: string;
  price: string;
  category: string;
  tag: string;
  seller: string;
  description?: string;
};

type TreasureCardProps = {
  item: TreasureCardItem;
  featured?: boolean;
};

export default function TreasureCard({
  item,
  featured = false,
}: TreasureCardProps) {
  return (
    <article
      className={`
        group relative overflow-visible rounded-[2rem] border [text-shadow:none]
        bg-slate-950/35 p-3 backdrop-blur-none
        transition-all duration-300 ease-out
        hover:-translate-y-3
        ${
          featured
            ? "border-amber-300/70 shadow-[0_0_28px_rgba(251,191,36,0.32)] hover:shadow-[0_0_42px_rgba(251,191,36,0.55)]"
            : "border-cyan-400/20 hover:border-cyan-300/55 hover:shadow-[0_0_30px_rgba(34,211,238,0.22)]"
        }
      `}
    >
      
      <Link
        href={`/listing/${item.slug}`}
        className="block rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-amber-300"
      >
        {/* Realistic product artwork */}
        <div
          className="
            relative flex h-48 items-center justify-center
            overflow-hidden rounded-[1.4rem]
            border border-cyan-300/15
            bg-slate-800/80
          "
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="
                h-full w-full object-cover
                transition-transform duration-500
                group-hover:scale-[1.04]
              "
            />
          ) : (
            <span
              aria-hidden="true"
              className="text-6xl"
            >
              {"\u2693"}
            </span>
          )}

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0
              bg-gradient-to-t
              from-slate-950/35 via-transparent to-cyan-100/5
            "
          />
        </div>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">
          {item.tag}
        </p>

        <h3 className="mt-2 pr-10 text-xl font-black leading-tight text-white">
          {item.title}
        </h3>

        <div className="mt-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-3xl font-black text-amber-300">
            {item.price}
          </p>

          <span className="inline-block max-w-full break-words rounded-full bg-slate-950/75 px-3 py-1.5 text-[10px] font-bold leading-tight text-slate-100">
            {item.category}
          </span>
        </div>

        <p className="mt-4 text-sm text-sky-200/80">
          Seller: {item.seller}
        </p>
      </Link>

      {/* Harbor Watch diver */}
<HarborWatchButton
  item={{
    title: item.title,
    slug: item.slug,
    price: item.price,
    category: item.category,
    seller: item.seller,
  }}
/>
    </article>
  );
}



