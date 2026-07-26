import Link from "next/link";
import SailingShip from "./SailingShip";

export default function ChartOurCourse() {
  return (
    <section
      className="
        relative isolate min-h-[620px] overflow-hidden
        border-y border-amber-400/30
        bg-slate-950 bg-cover bg-center
        px-6 py-20 text-white
      "
      style={{
        
          backgroundImage: "url('/chart-course-ocean.png')",
      }}
    >
      {/* Darkens the image enough for readable wording */}
      <div className="absolute inset-0 -z-20 bg-slate-950/45" />

      {/* Extra darkness behind the wording only */}
      <div
        className="
          absolute inset-0 -z-10
          bg-gradient-to-r
          from-slate-950/90
          via-slate-950/55
          to-slate-950/10
        "
      />

      {/* Moving ship */}
      <SailingShip />

      {/* Page wording */}
      <div className="relative z-30 mx-auto max-w-6xl">
        <div className="max-w-2xl">
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
              max-w-xl text-4xl font-bold leading-tight
              text-white drop-shadow-lg
              sm:text-5xl lg:text-6xl
            "
          >
            Help Us Chart Our Course
          </h2>

          <p
            className="
              mt-6 max-w-xl text-lg leading-8
              text-slate-100 drop-shadow-md
            "
          >
            We&apos;re building Davey Jones Junk-N-Treasure with our
            community. Preview what&apos;s coming, share your ideas,
            and help shape the harbor before we officially set sail.
          </p>

          <Link
            href="/join-harbor"
            className="
              mt-9 inline-flex items-center justify-center
              rounded-lg border border-amber-300/70
              bg-amber-500/90 px-7 py-3
              font-semibold text-slate-950
              shadow-lg shadow-black/30
              transition
              hover:-translate-y-0.5
              hover:bg-amber-300
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-amber-300
            "
          >
            Come Aboard
          </Link>
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