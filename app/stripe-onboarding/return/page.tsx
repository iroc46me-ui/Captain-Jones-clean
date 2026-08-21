"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type PaymentStatus = {
  ok: boolean;
  readyForPayouts?: boolean;
  transferStatus?: string | null;
  hasCurrentRequirements?: boolean;
  error?: string;
};

export default function StripeOnboardingReturnPage() {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSellerStatus() {
      try {
        const response = await fetch("/api/seller-payment-status", {
          cache: "no-store",
        });

        const data = await response.json();
        setStatus(data);
      } catch {
        setStatus({
          ok: false,
          error: "Unable to check Stripe account status.",
        });
      } finally {
        setLoading(false);
      }
    }

    checkSellerStatus();
  }, []);

  const ready = status?.ok && status?.readyForPayouts === true;

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
          maxWidth: "650px",
          textAlign: "center",
        }}
      >
        {loading ? (
          <>
            <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
              Checking Your Stripe Account
            </h1>

            <p style={{ fontSize: "18px", opacity: 0.8 }}>
              Confirming your seller payment status...
            </p>
          </>
        ) : ready ? (
          <>
            <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
              Welcome Aboard
            </h1>

            <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
              Your Stripe seller account is connected and verified.
            </p>

            <p style={{ opacity: 0.8, marginTop: "12px" }}>
              Your account is ready to receive marketplace payouts.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "36px", marginBottom: "16px" }}>
              Stripe Setup Needs Attention
            </h1>

            <p style={{ fontSize: "18px", lineHeight: "1.6" }}>
              Your Stripe account still has setup requirements to complete.
            </p>

            <p style={{ opacity: 0.8, marginTop: "12px" }}>
              You can return to seller setup and finish the remaining steps.
            </p>
          </>
        )}

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