
export default function CaptainsPicksPage() {
  return (
    <main
      className="relative min-h-screen bg-slate-950 bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/land-and-sea.png?v=2')",
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-8 pt-8 sm:px-8 md:pt-12">
        {/* Title over the harbor artwork */}
        <header className="land-sea-reveal mx-auto w-full text-center text-white [text-shadow:0_2px_5px_rgba(0,0,0,0.95)]">
          <p className="font-serif text-xl font-bold tracking-[0.25em] sm:text-3xl md:text-5xl">
            FROM
          </p>

          <h1 className="mt-1 whitespace-nowrap font-serif text-[clamp(2rem,9vw,6rem)] font-black leading-none tracking-tight">
            LAND &amp; SEA
          </h1>

          <p className="mx-auto mt-3 max-w-full text-[9px] font-extrabold leading-snug tracking-wide sm:text-sm md:text-lg">
            TREASURES FROM EVERY SHORE, STORY, AND SEASON
          </p>
        </header>

        {/* Keep the description near the lower portion */}
        <div className="flex-1" />

        <section className="land-sea-reveal mx-auto w-full max-w-3xl px-2 py-4 text-center [text-shadow:0_2px_6px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black text-amber-300 sm:text-3xl">
            Discoveries from around the Harbor
          </h2>

          <p className="mt-4 text-base font-semibold leading-7 text-white sm:text-lg sm:leading-8">
            A changing mix of treasures from different sellers and
            categories will appear here — old, new, handmade, useful,
            unusual, and everything in between. Not ranked, not
            hand-picked favorites — just interesting things worth a
            closer look.
          </p>
        </section>

        <a
          href="/"
          className="mx-auto mt-5 w-fit rounded-full border border-amber-300/50 bg-slate-950/60 px-6 py-3 font-bold text-amber-200 transition hover:bg-amber-300 hover:text-black"
        >
          ← Return to Harbor
        </a>
      </div>
    </main>
  );
}
