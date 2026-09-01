import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050914] text-stone-100">
      <header className="border-b border-white/10 bg-[#030711]/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="text-3xl text-cyan-400">
            ⚓
          </Link>

          <Link
            href="/about"
            className="text-sm font-bold text-stone-200 transition hover:text-amber-300"
          >
            Return to About
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-14 sm:px-10">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
          Harbor Support
        </p>

        <h1 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
          Contact / Help
        </h1>

        <p className="mt-5 max-w-3xl leading-7 text-stone-300">
          Need help aboard the Harbor? Choose the area that best matches what
          you are trying to do.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <HelpCard
            title="Buyer or Seller Message"
            text="Questions about a listing or an existing Harbor conversation."
            href="/captains-locker/messages"
            button="Open Harbor Messages"
          />

          <HelpCard
            title="Seller Help"
            text="Manage listings, sold items, shipping, tracking, and seller activity."
            href="/seller-chest"
            button="Open Seller Chest"
          />

          <HelpCard
            title="Something Is Broken"
            text="Found a page, button, listing, or Harbor feature that is not working correctly?"
            href="/captains-log/rough-seas"
            button="Report Rough Seas"
          />

          <HelpCard
            title="Harbor Community"
            text="Visit the Captain's Log for Harbor ideas, updates, and community activity."
            href="/captains-log"
            button="Open Captain's Log"
          />

        </div>

        <section className="mt-10 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-7">
          <h2 className="font-serif text-2xl font-bold text-amber-200">
            Transaction Help
          </h2>

          <p className="mt-3 leading-7 text-stone-300">
            For questions about a specific listing or transaction, keep buyer
            and seller communication inside Harbor whenever possible. This
            creates a record of the conversation and helps protect both sides of
            the transaction.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <h2 className="font-serif text-2xl font-bold text-amber-200">
            Harbor Alpha Support
          </h2>

          <p className="mt-3 leading-7 text-stone-300">
            Davey Jones Junk-N-Treasure is still being prepared for broader
            marketplace use. Additional customer-support tools and direct
            support channels may be added as the Harbor grows.
          </p>
        </section>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          <Link href="/terms" className="hover:text-amber-300">
            Terms of Use
          </Link>

          <Link href="/privacy" className="hover:text-amber-300">
            Privacy Policy
          </Link>

          <Link href="/seller-rules" className="hover:text-amber-300">
            Seller Rules
          </Link>
        </div>
      </section>
    </main>
  );
}

function HelpCard({
  title,
  text,
  href,
  button,
}: {
  title: string;
  text: string;
  href: string;
  button: string;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-7">
      <h2 className="font-serif text-2xl font-bold text-amber-200">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-stone-300">{text}</p>

      <Link
        href={href}
        className="mt-6 inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/20"
      >
        {button}
      </Link>
    </section>
  );
}