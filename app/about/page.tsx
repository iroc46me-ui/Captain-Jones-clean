import Link from "next/link";

export default function AboutPage() {
  return (
    <main
      className="min-h-screen bg-[#050914] text-stone-100"
      style={{
        backgroundImage: "url('/about-background-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* TOP NAVIGATION */}
      <header className="border-b border-white/10 bg-[#030711]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 sm:px-10 lg:px-16">
          <Link
            href="/"
            className="text-3xl text-cyan-400"
            aria-label="Davey Jones Junk-N-Treasure Home"
          >
            ⚓
          </Link>

          <nav className="flex flex-wrap items-center justify-end gap-x-8 gap-y-3 text-sm font-bold text-stone-100">
            <Link href="/" className="transition hover:text-amber-300">
              Home
            </Link>

            <Link
              href="/seller-chest"
              className="transition hover:text-amber-300"
            >
              Sell Your Treasure
            </Link>

            <Link
              href="/treasure-deck"
              className="transition hover:text-amber-300"
            >
              Treasure Deck
            </Link>

            <Link
              href="/captains-picks"
              className="transition hover:text-amber-300"
            >
              The Captain&apos;s Picks
            </Link>

            <Link
              href="/harbor-sellers"
              className="transition hover:text-amber-300"
            >
              Harbor Sellers
            </Link>

            <Link
              href="/captains-log"
              className="transition hover:text-amber-300"
            >
              Captain&apos;s Log
            </Link>

            <Link
  href="/fresh-arrivals"
  className="transition hover:text-amber-300"
>
  Fresh Arrivals
</Link>

            <Link
              href="/about"
              className="text-amber-300"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN ABOUT CONTENT */}
      <section className="mx-auto flex min-h-[calc(100vh-145px)] max-w-7xl items-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="w-full max-w-[560px] rounded-[28px] border border-amber-300/70 bg-[#05070c]/90 p-8 shadow-2xl backdrop-blur-[2px] sm:p-10">

          {/* ABOUT INTRO */}
          <p className="text-sm font-black uppercase tracking-[0.28em] text-amber-300">
            About the Harbor
          </p>

          <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
            Built for useful junk,
            <br />
            rare finds, and
            <br />
            honest treasure.
          </h1>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-amber-300/60" />
            <span className="text-2xl text-amber-300">⚓</span>
            <div className="h-px flex-1 bg-amber-300/60" />
          </div>

          <p className="text-base leading-7 text-stone-200">
            Davey Jones Junk-N-Treasure is a harbor-style marketplace
            for sellers, collectors, prospectors, estate finds,
            handmade tools, RV parts, oddities, and stories worth
            keeping.
          </p>

          <p className="mt-5 text-base leading-7 text-stone-200">
            The goal is simple: lower fees, real sellers, trusted
            listings, and a marketplace with character instead of a
            cold corporate catalog.
          </p>

          {/* HOW THE HARBOR WORKS */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-amber-300/60" />

            <h2 className="whitespace-nowrap text-sm font-black uppercase tracking-[0.22em] text-amber-300">
              How the Harbor Works
            </h2>

            <div className="h-px flex-1 bg-amber-300/60" />
          </div>

          <div className="space-y-5">

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-300 text-xl text-amber-300">
                🧰
              </div>

              <div>
                <h3 className="font-bold text-amber-200">
                  Sellers bring the treasure.
                </h3>

                <p className="mt-1 text-sm leading-6 text-stone-300">
                  List your items with fair fees and real support.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-300 text-xl text-amber-300">
                ⚙️
              </div>

              <div>
                <h3 className="font-bold text-amber-200">
                  We give it a place in the harbor.
                </h3>

                <p className="mt-1 text-sm leading-6 text-stone-300">
                  Trusted listings, clear policies, and a secure
                  marketplace.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-300 text-xl text-amber-300">
                🧭
              </div>

              <div>
                <h3 className="font-bold text-amber-200">
                  Buyers explore the Treasure Deck.
                </h3>

                <p className="mt-1 text-sm leading-6 text-stone-300">
                  Find useful junk, rare finds, and honest treasure.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-amber-300 text-xl text-amber-300">
                🔒
              </div>

              <div>
                <h3 className="font-bold text-amber-200">
                  Purchases are handled securely.
                </h3>

                <p className="mt-1 text-sm leading-6 text-stone-300">
                  Payments are safe. Sellers get paid. Everyone wins.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-amber-300/30 bg-[#030711]/95">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-sm text-stone-300 sm:px-10 lg:px-16">
          <span>© 2026 Davey Jones Junk-N-Treasure</span>

          <span className="hidden text-amber-300 sm:inline">|</span>

          <Link
            href="/terms"
            className="transition hover:text-amber-300"
          >
            Terms of Use
          </Link>

          <span className="hidden text-amber-300 sm:inline">|</span>

          <Link
            href="/privacy"
            className="transition hover:text-amber-300"
          >
            Privacy Policy
          </Link>

          <span className="hidden text-amber-300 sm:inline">|</span>

          <Link
            href="/seller-rules"
            className="transition hover:text-amber-300"
          >
            Seller Rules
          </Link>

          <span className="hidden text-amber-300 sm:inline">|</span>

          <Link
            href="/contact"
            className="transition hover:text-amber-300"
          >
            Contact / Help
          </Link>
        </div>
      </footer>
    </main>
  );
}