export default function CaptainsLogPage() {
  return (
    <main
      className="min-h-screen bg-slate-950 bg-cover bg-center bg-fixed text-white"
      style={{
        backgroundImage: "url('/chart-course-construction.png')",
      }}
    >
      <div className="min-h-screen bg-gradient-to-r from-slate-950/80 via-slate-950/25 to-transparent">
        <div className="mx-auto max-w-7xl px-3 py-20 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-amber-300 drop-shadow-lg">
              Captain&apos;s Log
            </p>

            <h1 className="text-4xl font-black leading-tight drop-shadow-2xl sm:text-5xl lg:text-6xl">
              Help Shape the Harbor
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium leading-8 text-amber-100 drop-shadow-2xl sm:text-xl">
              Davey Jones Junk-N-Treasure is being built one deck plank at a
              time. We&apos;d rather build what real buyers and sellers
              actually want than guess. This is where the Harbor Crew helps
              chart our course.
            </p>
            
            <p className="mt-5 text-xl font-semibold italic text-amber-300 drop-shadow-xl sm:text-2xl">
                  Come aboard. Be part of the crew.
             </p>


            <section id="vote" className="mt-16 max-w-xl">
  <h2 className="text-3xl font-bold text-amber-300 drop-shadow-xl">
    Vote on Features
  </h2>

  <p className="mt-4 text-lg leading-8 text-white drop-shadow-xl">
    Help decide what gets built next. Vote on new Harbor features and
    help move the most useful ideas toward the top of the Captain&apos;s
    build list.
  </p>

  <a
    href="/captains-log/vote"
    className="mt-5 inline-block rounded-full border border-amber-300/60 bg-slate-950/70 px-6 py-3 font-bold text-amber-200 shadow-lg transition hover:-translate-y-1 hover:bg-amber-300 hover:text-slate-950"
  >
    Cast Your Vote
  </a>
</section>


<section id="ideas" className="mt-14 max-w-xl">
  <h2 className="text-3xl font-bold text-cyan-300 drop-shadow-xl">
    Suggest an Idea
  </h2>

  <p className="mt-4 text-lg leading-8 text-white drop-shadow-xl">
    Have an idea for buying, selling, searching, shipping, ratings,
    categories, auctions, or something we haven&apos;t thought of yet?
    Put it in the Captain&apos;s Log.
  </p>

  <a
    href="/captains-log/ideas"
    className="mt-5 inline-block rounded-full border border-cyan-300/60 bg-slate-950/70 px-6 py-3 font-bold text-cyan-200 shadow-lg transition hover:-translate-y-1 hover:bg-cyan-300 hover:text-slate-950"
  >
    Log an Idea
  </a>
</section>


<section id="problems" className="mt-14 max-w-xl">
  <h2 className="text-3xl font-bold text-red-300 drop-shadow-xl">
    Report Rough Seas
  </h2>

  <p className="mt-4 text-lg leading-8 text-white drop-shadow-xl">
    Found a broken button, confusing wording, a mobile problem, or
    something that simply doesn&apos;t work? Tell the Captain so we can
    repair it before the Harbor officially opens.
  </p>

  <a
    href="/captains-log/rough-seas"
    className="mt-5 inline-block rounded-full border border-red-300/60 bg-slate-950/70 px-6 py-3 font-bold text-red-200 shadow-lg transition hover:-translate-y-1 hover:bg-red-300 hover:text-slate-950"
  >
    Report a Problem
  </a>
</section>


<div className="mt-16 pb-24">
  <a
    href="/"
    className="inline-block rounded-full border border-white/30 bg-slate-950/70 px-7 py-3 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:border-amber-300 hover:text-amber-200"
  >
    ⚓ Return to Harbor
  </a>
</div>
      </div>
      </div>
              
            
          
        </div>
      
    </main>
  );
} 