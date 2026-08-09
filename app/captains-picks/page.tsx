export default function CaptainsPicksPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-300">
          Hand Selected by the Captain
        </p>

        <h1 className="mt-4 text-5xl font-black">
          The Captain&apos;s Picks
        </h1>

        <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-300">
          A hand-picked collection of unusual finds, forgotten valuables,
          interesting antiques, and treasures worth a closer look.
        </p>

        <div className="mt-12 rounded-3xl border border-amber-300/30 bg-black/30 p-10">
          <h2 className="text-2xl font-bold text-amber-300">
            The Captain is choosing the first treasures...
          </h2>

          <p className="mt-4 text-lg text-slate-300">
            Featured picks will appear here soon.
          </p>
        </div>

        <a
          href="/"
          className="mt-10 inline-block rounded-full border border-amber-300/50 px-6 py-3 font-bold text-amber-200 hover:bg-amber-300 hover:text-black"
        >
          ← Return to Harbor
        </a>
      </div>
    </main>
  );
}