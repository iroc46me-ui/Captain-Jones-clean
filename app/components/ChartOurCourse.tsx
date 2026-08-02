import Link from "next/link";
import SailingShip from "./SailingShip";

export default function ChartOurCourse() {
  return (
    <section
      id="chart-our-course"
      className="
        relative isolate min-h-[620px] overflow-hidden
        border-y border-amber-400/30
        bg-slate-950 bg-cover bg-center
        px-6 py-20 text-white
      "
      style={{
       backgroundImage: "url('/chart-course-construction.png')"
      }}
    >
      {/* Darkens the image enough for readable wording */}
      <div className="absolute inset-0 -z-20 bg-slate-950/45" />

      {/* Extra darkness behind the wording only */}
      <div
        className="
          absolute inset-0 -z-10
          bg-gradient-to-r
          from-slate-950/95
          via-slate-950/65
          to-slate-950/15
        "
      />

      {/* Moving ship */}
      <SailingShip />

      {/* Page wording */}
      <div className="relative z-30 mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p
            className="
              mb-4 text-sm font-semibold uppercase
              tracking-[0.3em] text-amber-300
            "
          >
            Captain&apos;s Preview
          </p>

          <h2
            className="
              max-w-2xl text-4xl font-bold leading-tight
              text-white drop-shadow-lg
              sm:text-5xl lg:text-6xl
            "
          >
            Help Us Chart the Harbor&apos;s Course
          </h2>

          <p
            className="
              mt-6 max-w-2xl text-lg leading-8
              text-slate-100 drop-shadow-md
            "
          >
            Davey Jones Junk-N-Treasure is still being built. Help shape
            what comes next by voting on features, sharing ideas, or reporting
            rough seas before the Harbor officially sets sail.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            <Link
              href="/chart-our-course#vote"
              className="
                inline-flex items-center justify-center
                rounded-lg border border-amber-300/70
                bg-amber-500/90 px-5 py-3
                text-center font-semibold text-slate-950
                shadow-lg shadow-black/30
                transition
                hover:-translate-y-0.5
                hover:bg-amber-300
              "
            >
              Vote on Features
            </Link>

            <Link
              href="/chart-our-course#ideas"
              className="
                inline-flex items-center justify-center
                rounded-lg border border-cyan-300/50
                bg-slate-950/75 px-5 py-3
                text-center font-semibold text-white
                shadow-lg shadow-black/30
                transition
                hover:-translate-y-0.5
                hover:border-cyan-200
                hover:bg-cyan-950/90
              "
            >
              Suggest an Idea
            </Link>

            <Link
              href="/chart-our-course#problems"
              className="
                inline-flex items-center justify-center
                rounded-lg border border-white/20
                bg-slate-950/75 px-5 py-3
                text-center font-semibold text-white
                shadow-lg shadow-black/30
                transition
                hover:-translate-y-0.5
                hover:border-amber-300/70
                hover:bg-slate-900
              "
            >
              Report Rough Seas
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade into the next section */}
      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-0
          h-32 bg-gradient-to-t
          from-slate-950/90 to-transparent
        "
      />
    </section>
  );
}