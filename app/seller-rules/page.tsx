import Link from "next/link";

export default function SellerRulesPage() {
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
          Harbor Code
        </p>

        <h1 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
          Seller Rules
        </h1>

        <p className="mt-5 leading-7 text-stone-300">
          Sellers help determine the reputation of the Harbor. Accurate
          listings, honest communication, careful shipping, and fair dealing
          are expected from everyone offering treasure for sale.
        </p>

        <div className="mt-10 space-y-8">
          <Rule title="Own What You Sell">
            Sellers must own the item or have legal authority to sell it.
            Stolen property, counterfeit goods, fraudulent listings, and illegal
            merchandise are prohibited.
          </Rule>

          <Rule title="Describe Treasure Honestly">
            Listings must accurately describe the item, including condition,
            defects, missing parts, repairs, important measurements, and other
            information that could materially affect a buyer&apos;s decision.
          </Rule>

          <Rule title="Use Real Photos and Information">
            Listing images and descriptions should represent the actual item
            being offered unless the listing clearly explains otherwise.
          </Rule>

          <Rule title="Price and Terms Must Be Clear">
            Sellers are responsible for clearly stating the price, shipping
            arrangement, local pickup terms, and other material conditions of
            sale.
          </Rule>

          <Rule title="Keep Communication Inside Harbor">
            Buyer and seller communication should remain inside Harbor
            messaging before purchase. Do not use phone numbers, outside payment
            links, social media, or other methods to bypass Harbor systems.
          </Rule>

          <Rule title="Fulfill Paid Orders">
            Sellers are responsible for packaging, shipping, local pickup,
            tracking, and fulfillment after a valid purchase.
          </Rule>

          <Rule title="Provide Tracking When Shipped">
            When an item is shipped, the seller should provide an accurate
            carrier and tracking number through the Seller Chest when tracking
            is available.
          </Rule>

          <Rule title="Communicate Problems Promptly">
            If an item is damaged, unavailable, delayed, or otherwise cannot be
            fulfilled as promised, the seller should communicate promptly and
            cooperate with Harbor support and the buyer.
          </Rule>

          <Rule title="No Harassment or Abuse">
            Threats, harassment, discriminatory abuse, intimidation, spam, and
            deceptive behavior are not permitted.
          </Rule>

          <Rule title="Respect Harbor Decisions">
            Davey Jones Junk-N-Treasure may remove listings, suspend seller
            privileges, restrict accounts, or take other reasonable action when
            Harbor rules are violated or marketplace safety is at risk.
          </Rule>
        </div>

        <div className="mt-10 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 p-6">
          <p className="font-bold text-cyan-200">
            The Harbor Standard
          </p>

          <p className="mt-2 leading-7 text-stone-300">
            Sell it as you would want someone to sell it to you: describe it
            honestly, answer questions clearly, pack it carefully, and finish
            the transaction properly.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          <Link href="/terms" className="hover:text-amber-300">
            Terms of Use
          </Link>

          <Link href="/privacy" className="hover:text-amber-300">
            Privacy Policy
          </Link>

          <Link href="/contact" className="hover:text-amber-300">
            Contact / Help
          </Link>
        </div>
      </section>
    </main>
  );
}

function Rule({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="flex items-center gap-3 font-serif text-2xl font-bold text-amber-200">
        <span className="text-cyan-300">⚓</span>
        {title}
      </h2>

      <p className="mt-3 leading-7 text-stone-300">{children}</p>
    </section>
  );
}