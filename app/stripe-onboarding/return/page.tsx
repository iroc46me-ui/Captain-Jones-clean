"use client";

import Link from "next/link";

export default function StripeOnboardingReturnPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "white",
        fontFamily: "sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
          Welcome Aboard
        </h1>

        <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
          Your Stripe setup has been returned to Davey Jones Junk N Treasure.
        </p>

        <p style={{ opacity: 0.8, marginTop: "12px" }}>
          Your seller payment account is now connected to the Harbor.
        </p>

        <Link
          href="/harbor-sellers"
          style={{
            display: "inline-block",
            marginTop: "28px",
            padding: "14px 24px",
            borderRadius: "8px",
            background: "#d4af37",
            color: "#020617",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Return to Harbor Sellers
        </Link>
      </div>
    </main>
  );
}   