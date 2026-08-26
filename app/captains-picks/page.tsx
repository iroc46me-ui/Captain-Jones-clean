export default function CaptainsPicksPage() {
  return (
    <main
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: "url('/land-and-sea.png')",
      }}
    >
      <div className="min-h-screen bg-slate-950/20">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-16 pt-80">

          <div className="land-sea-reveal rounded-3xl border border-amber-300/30 bg-slate-950/75 p-8 shadow-2xl backdrop-blur-sm sm:p-10">
            <h1 className="text-3xl font-black text-amber-300">
              Discoveries from around the Harbor
            </h1>

            <p className="mt-4 max-w-4xl text-lg leading-8 text-slate-200">
              A changing mix of treasures from different sellers and categories
              will appear here — old, new, handmade, useful, unusual, and
              everything in between. Not ranked, not hand-picked favorites —
              just interesting things worth a closer look.
            </p>
          </div>

          <a
            href="/"
            className="land-sea-reveal mt-6 w-fit rounded-full border border-amber-300/50 bg-slate-950/70 px-6 py-3 font-bold text-amber-200 transition hover:bg-amber-300 hover:text-black"
          >
            ← Return to Harbor
          </a>

        </div>
      </div>
    </main>
  );
}