export default function DockmastersNotice() {
  return (
    <section className="bg-slate-900 border-y border-amber-400/20 px-6 py-16">
      <div className="mx-auto max-w-5xl rounded-3xl border border-amber-500/25 bg-gradient-to-b from-slate-800 to-slate-950 p-10 shadow-2xl">

        <p className="text-sm uppercase tracking-[0.35em] text-amber-400">
          Dockmaster's Notice
        </p>

        <h2 className="mt-4 text-4xl font-bold text-white">
          New Arrivals at the Harbor
        </h2>

        <p className="mt-8 text-lg leading-8 text-slate-300">
          Throughout the day, new discoveries are welcomed into the harbor.
          Some are rare. Some are practical. Others carry stories that have
          traveled far before reaching these docks.
        </p>

        <p className="mt-6 text-lg leading-8 text-slate-300">
          Take your time exploring. The finest treasures are often found by
          those willing to look beyond the obvious.
        </p>

        <div className="mt-10 border-t border-amber-400/20 pt-6">
          <p className="text-amber-300 font-semibold">
            By Order of the Dockmaster
          </p>
        </div>

      </div>
    </section>
  );
}