"use client";

import { useEffect } from "react";

export default function StripeOnboardingRefreshPage() {
  useEffect(() => {
    async function refreshOnboarding() {
      try {
        const accountId = "acct_1U6f1KAP0ztOQFEL";

        const response = await fetch("/api/create-account-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ accountId }),
        });

        const data = await response.json();

        if (!response.ok || !data.url) {
          throw new Error("Could not create a fresh Stripe onboarding link.");
        }

        window.location.href = data.url;
      } catch (error) {
        console.error(error);
      }
    }

    refreshOnboarding();
  }, []);

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
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Returning to Stripe…</h1>
        <p>Creating a fresh onboarding link.</p>
      </div>
    </main>
  );
}