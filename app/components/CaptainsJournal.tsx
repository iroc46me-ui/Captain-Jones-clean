export default function CaptainsLog() {
  return (
    <section
      id="captains-log"
      className="relative overflow-hidden border-y border-amber-300/20 bg-[#07131f] px-6 py-20 text-stone-100"
    >
      {/* Soft background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(184, 134, 55, 0.15), transparent 42%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-amber-200/20 bg-black/35 px-7 py-12 shadow-2xl backdrop-blur-sm sm:px-12 md:py-16">
          <p className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
            From the Captain’s Desk
          </p>

          <h2 className="text-center font-serif text-4xl font-bold tracking-wide text-stone-100 sm:text-5xl">
            Captain’s Log
          </h2>

          <div className="mx-auto my-8 h-px w-32 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

          <div className="mx-auto max-w-3xl space-y-5 font-serif text-lg leading-8 text-stone-200 sm:text-xl sm:leading-9">
            <p>
              Many who arrive at this harbor come searching for treasure.
            </p>

            <p>
              Some seek antiques that have survived generations. Others search
              for handcrafted creations, forgotten collectibles, or that one
              unexpected discovery that somehow finds its way into their hands.
            </p>

            <p>Over the years, I’ve learned something surprising.</p>

            <p className="text-amber-100">
              The greatest treasures are often the stories that travel with
              them.
            </p>

            <p>
              Every weathered tool, old photograph, handmade piece, and curious
              keepsake once belonged somewhere. Someone cared for it, used it,
              admired it, or passed it along.
            </p>

            <p>This harbor was built to give those treasures another voyage.</p>

            <p>
              Whether you’re here to browse, sell, or simply enjoy the walk
              along the docks, you’re welcome here.
            </p>

            <div className="pt-3 text-center">
              <p className="text-2xl font-semibold text-amber-200">
                Drop your anchor.
              </p>

              <p className="mt-2">Take your time.</p>

              <p className="mt-2 italic text-stone-300">
                The tide has a way of bringing remarkable things ashore.
              </p>
            </div>
          </div>

          <p className="mt-10 text-right font-serif text-xl italic text-amber-200">
            — Captain Jones
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="#marketplace"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-300/50 bg-amber-500/10 px-7 py-3 font-semibold tracking-wide text-amber-100 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-400/20 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#07131f]"
            >
              Continue Along the Docks
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}