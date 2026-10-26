"use client";

import { useEffect, useState } from "react";

export default function StripeOnboardingRefreshPage() {
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function refreshOnboarding() {
      try {
        const response = await fetch("/api/create-account-link", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });

        const data = await response.json();

        if (!response.ok || !data.url) {
          if (response.status === 401) {
            throw new Error(
              "Please sign in to your seller account before continuing."
            );
          }

          throw new Error(
            "Unable to create your Stripe onboarding link. Please return to your seller dashboard and try again."
          );
        }

        window.location.href = data.url;
      } catch (error) {
        console.error("Stripe onboarding refresh failed:", error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
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
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>
          {errorMessage ? "Stripe Connection Unavailable" : "Returning to Stripe…"}
        </h1>

        <p>
          {errorMessage || "Creating a fresh onboarding link."}
        </p>
      </div>
    </main>
  );
}