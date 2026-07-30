import Link from "next/link";
import UnderwaterLayers from "./UnderwaterLayers";

export default function HarborAlpha() {
  return (
    <section className="relative overflow-hidden border-y border-amber-400/20 bg-slate-950">
  <div
    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-100 brightness-125 saturate-125 contrast-110"  
    style={{
      backgroundImage: "url('/harbor-alpha-master-background.png')",
    }}
  />
    
      <div className="relative z-10 mx-auto max-w-6xl rounded-3xl border border-amber-400/25 bg-slate-900/55 px-7 py-10 shadow-2xl sm:px-10 lg:px-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.32em] text-amber-400">
              Harbor Alpha
            </p>

            <h2 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
              The harbor is open, and the first crew is coming aboard.
            </h2>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Davey Jones Junk-N-Treasure is opening while new docks, tools,
              rewards, and marketplace features are still being built. Early
              members will help shape what the harbor becomes.
            </p>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Join the harbor, bring your treasures to market, and earn
              recognition for being among those who crossed the stormy seas
              before the harbor was complete.
            </p>

            <div className="mt-8 rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.04] px-5 py-4">
              <p className="font-semibold text-cyan-100">
                Founding Crew recognition will be reserved for members who
                joined during Harbor Alpha.
              </p>
            </div>
          </div>

          <div className="flex min-w-60 flex-col gap-4">
            <Link
              href="#join"
              className="inline-flex items-center justify-center rounded-full bg-amber-400 px-7 py-4 text-base font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
            >
              Join the Founding Crew
            </Link>

            <Link
              href="/seller-chest"
              className="inline-flex items-center justify-center rounded-full border border-amber-400/50 px-7 py-4 text-base font-bold text-white transition hover:-translate-y-0.5 hover:bg-amber-400/10 focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              Bring Treasure to Harbor
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}