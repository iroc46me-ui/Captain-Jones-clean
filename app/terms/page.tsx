import Link from "next/link";

export default function TermsPage() {
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
          Harbor Policies
        </p>

        <h1 className="mt-4 font-serif text-4xl font-bold text-white sm:text-5xl">
          Terms of Use
        </h1>

        <p className="mt-5 leading-7 text-stone-300">
          These Terms of Use explain the basic rules for using Davey Jones
          Junk-N-Treasure, including marketplace participation, listings,
          purchases, communication, and account conduct.
        </p>

        <div className="mt-10 space-y-8">
          <PolicySection title="1. Using the Harbor">
            Davey Jones Junk-N-Treasure provides marketplace tools that allow
            buyers and sellers to discover items, communicate, list goods, and
            complete transactions. Users are responsible for using the Harbor
            lawfully and honestly.
          </PolicySection>

          <PolicySection title="2. Accounts and Identity">
            Users are responsible for maintaining accurate account information
            and protecting access to their accounts. You may not impersonate
            another person, misrepresent ownership, or use an account for fraud,
            abuse, or prohibited activity.
          </PolicySection>

          <PolicySection title="3. Listings">
            Sellers are responsible for accurately describing the item being
            offered, including condition, price, shipping or pickup terms, and
            any important limitations. Sellers must have the legal right to
            offer the item for sale.
          </PolicySection>

          <PolicySection title="4. Purchases">
            Buyers are responsible for reviewing listings, asking questions
            before purchase, providing accurate payment and shipping
            information, and understanding the terms of the transaction.
          </PolicySection>

          <PolicySection title="5. Harbor Communication">
            Buyer and seller communication should remain inside Harbor messaging
            when marketplace messaging is available. Attempts to move a
            transaction outside the Harbor in order to avoid marketplace rules
            or fees may result in account or listing restrictions.
          </PolicySection>

          <PolicySection title="6. Payments">
            Marketplace payments may be processed through third-party payment
            providers. Davey Jones Junk-N-Treasure does not directly store full
            payment-card information.
          </PolicySection>

          <PolicySection title="7. Shipping and Fulfillment">
            Sellers are responsible for packaging, shipping, tracking, local
            pickup arrangements, and fulfillment according to the listing and
            applicable marketplace rules.
          </PolicySection>

          <PolicySection title="8. Prohibited Conduct">
            Fraud, stolen property, counterfeit goods, deceptive listings,
            harassment, threats, payment circumvention, illegal goods, and other
            prohibited activity are not permitted.
          </PolicySection>

          <PolicySection title="9. Marketplace Enforcement">
            Davey Jones Junk-N-Treasure may remove listings, restrict accounts,
            suspend marketplace access, or take other reasonable action when
            rules are violated or marketplace safety is at risk.
          </PolicySection>

          <PolicySection title="10. Marketplace Role">
            The Harbor provides marketplace, communication, and transaction
            tools. Sellers remain responsible for the items they list and buyers
            remain responsible for purchasing decisions.
          </PolicySection>

          <PolicySection title="11. Changes to These Terms">
            Marketplace features and policies may change as the Harbor develops.
            Updated terms may be posted on this page when changes are made.
          </PolicySection>
        </div>

        <HarborNotice />

        <PolicyFooter />
      </section>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="font-serif text-2xl font-bold text-amber-200">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-stone-300">{children}</p>
    </section>
  );
}

function HarborNotice() {
  return (
    <div className="mt-10 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-6">
      <p className="font-bold text-amber-200">Harbor Alpha Notice</p>

      <p className="mt-2 leading-7 text-stone-300">
        These terms are a working marketplace policy for Harbor Alpha and should
        receive final legal review before full public launch.
      </p>
    </div>
  );
}

function PolicyFooter() {
  return (
    <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
      <Link href="/privacy" className="hover:text-amber-300">
        Privacy Policy
      </Link>

      <Link href="/seller-rules" className="hover:text-amber-300">
        Seller Rules
      </Link>

      <Link href="/contact" className="hover:text-amber-300">
        Contact / Help
      </Link>
    </div>
  );
}