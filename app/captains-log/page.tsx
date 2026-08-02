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

            <section id="vote" className="mt-16 max-w-xl">
              <h2 className="text-3xl font-bold text-amber-300 drop-shadow-xl">
                Vote on Features
              </h2>

              <p className="mt-4 text-lg leading-8 text-white drop-shadow-xl">
                Future visitors will vote on new Harbor features. The most
                requested ideas move to the top of the Captain&apos;s build
                list.
              </p>
            </section>

            <section id="ideas" className="mt-14 max-w-xl">
              <h2 className="text-3xl font-bold text-cyan-300 drop-shadow-xl">
                Suggest an Idea
              </h2>

              <p className="mt-4 text-lg leading-8 text-white drop-shadow-xl">
                Have an idea for buying, selling, searching, shipping, ratings,
                auctions, or anything else? Drop your message in the
                Captain&apos;s Log.
              </p>
            </section>

            <section id="problems" className="mt-14 max-w-xl pb-24">
              <h2 className="text-3xl font-bold text-red-300 drop-shadow-xl">
                Report Rough Seas
              </h2>

              <p className="mt-4 text-lg leading-8 text-white drop-shadow-xl">
                Found a broken button, confusing wording, or something that
                doesn&apos;t work? Tell us here so we can fix it before the
                Harbor officially opens.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
} 