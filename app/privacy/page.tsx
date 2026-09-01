import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <p className="mt-5 leading-7 text-stone-300">
          Davey Jones Junk-N-Treasure respects the privacy of buyers, sellers,
          and visitors. This page explains the types of information the Harbor
          may use to operate the marketplace.
        </p>

        <div className="mt-10 space-y-8">
          <PrivacySection title="Information You Provide">
            Information may include account details, name, email address,
            marketplace profile information, listing information, buyer and
            seller messages, shipping information, and other information you
            voluntarily provide while using the Harbor.
          </PrivacySection>

          <PrivacySection title="Account Information">
            Authentication services may be used to create accounts, verify
            identity, and maintain secure sign-in sessions.
          </PrivacySection>

          <PrivacySection title="Payment Information">
            Payments may be handled by third-party payment processors. Davey
            Jones Junk-N-Treasure does not need to directly store complete
            payment-card numbers in order to operate the marketplace.
          </PrivacySection>

          <PrivacySection title="Marketplace Activity">
            The Harbor may retain information about listings, orders,
            communication, shipping status, transaction records, and account
            activity when needed to operate the marketplace, prevent abuse, and
            resolve problems.
          </PrivacySection>

          <PrivacySection title="How Information Is Used">
            Information may be used to operate marketplace features, maintain
            accounts, process transactions, display listings, support buyer and
            seller communication, prevent fraud, provide customer support, and
            improve the Harbor.
          </PrivacySection>

          <PrivacySection title="Service Providers">
            Davey Jones Junk-N-Treasure may rely on third-party providers for
            hosting, authentication, databases, file storage, payments, and
            related marketplace infrastructure.
          </PrivacySection>

          <PrivacySection title="Information Sharing">
            Personal information should not be sold as a normal part of Harbor
            operations. Information may be shared when necessary to complete a
            transaction, operate marketplace services, comply with law, prevent
            fraud, protect users, or enforce Harbor rules.
          </PrivacySection>

          <PrivacySection title="Buyer and Seller Privacy">
            Buyer and seller contact information should remain private until
            disclosure is necessary for a legitimate transaction or
            fulfillment purpose.
          </PrivacySection>

          <PrivacySection title="Data Security">
            Reasonable technical and operational safeguards should be used to
            protect marketplace information. No internet service can guarantee
            absolute security.
          </PrivacySection>

          <PrivacySection title="Policy Updates">
            This Privacy Policy may be updated as marketplace features and legal
            requirements develop.
          </PrivacySection>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-6">
          <p className="font-bold text-amber-200">Harbor Alpha Notice</p>

          <p className="mt-2 leading-7 text-stone-300">
            This Privacy Policy is a working Harbor Alpha policy and should be
            reviewed before full public launch to ensure it accurately reflects
            the final production system and applicable legal requirements.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-white/10 pt-8 text-sm">
          <Link href="/terms" className="hover:text-amber-300">
            Terms of Use
          </Link>

          <Link href="/seller-rules" className="hover:text-amber-300">
            Seller Rules
          </Link>

          <Link href="/contact" className="hover:text-amber-300">
            Contact / Help
          </Link>
        </div>
      </section>
    </main>
  );
}

function PrivacySection({
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