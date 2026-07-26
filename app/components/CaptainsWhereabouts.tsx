const harborEntries = [
  "⚓ The Captain is inspecting the docks and will return shortly.",
  "🎣 The Captain is out fishing today. The harbor remains open.",
  "🗺️ The Captain is charting new waters in search of forgotten treasures.",
  "📦 The Captain is collecting another load of treasures for the harbor.",
  "🚐 The Captain is traveling the coast looking for hidden finds.",
  "🏕️ The Captain is camped beneath the stars and checking in when he can.",
  "☕ The Captain is enjoying a cup of coffee while planning the next voyage.",
  "🌊 The tide is out... and so is the Captain. He'll be back soon.",
];

const customEntry = "";

export default function CaptainsLog() {
  const automaticEntry = harborEntries[0];

  const entry = customEntry.trim() || automaticEntry;
  return (
    <section className="border-y border-amber-400/25 bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl rounded-2xl border border-amber-400/25 bg-white/[0.03] px-6 py-7">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
          Captain&apos;s Log
        </p>

        <p className="mt-4 text-lg leading-8 text-slate-200">
          {entry}
        </p>
      </div>
    </section>
  );
}