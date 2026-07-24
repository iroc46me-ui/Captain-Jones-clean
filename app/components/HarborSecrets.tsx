"use client";

import { useEffect, useState } from "react";
import styles from "./HarborSecrets.module.css";

type HarborSecret = {
  id: string;
  symbol: string;
  name: string;
  message: string;
};

const harborSecrets: HarborSecret[] = [
  {
    id: "coin-crab",
    symbol: "🦀",
    name: "The Coin Crab",
    message: "That little rascal dropped a harbor coin!",
  },
  {
    id: "message-bottle",
    symbol: "🍾",
    name: "Message in a Bottle",
    message: "The tide carried a message from a distant shore.",
  },
  {
    id: "harbor-cat",
    symbol: "🐈",
    name: "The Harbor Cat",
    message: "You found the harbor cat hiding near the docks!",
  },
  {
    id: "sea-turtle",
    symbol: "🐢",
    name: "Harbor the Turtle",
    message: "Harbor stopped by during her afternoon swim.",
  },
  {
    id: "glowing-pearl",
    symbol: "🦪",
    name: "The Glowing Pearl",
    message: "A rare pearl shimmered beneath the harbor lights.",
  },
];

export default function HarborSecrets() {
  const [secret, setSecret] = useState<HarborSecret | null>(null);
  const [discoveryMessage, setDiscoveryMessage] = useState("");
  const [coinCount, setCoinCount] = useState(0);

  useEffect(() => {
    const savedCoins = Number(
      window.localStorage.getItem("harbor-coin-count") ?? "0"
    );

    setCoinCount(savedCoins);

    const firstAppearance = window.setTimeout(() => {
      showRandomSecret();
    }, 6000);

    const repeatingAppearance = window.setInterval(() => {
      showRandomSecret();
    }, 45000);

    return () => {
      window.clearTimeout(firstAppearance);
      window.clearInterval(repeatingAppearance);
    };
  }, []);

  function showRandomSecret() {
    const randomIndex = Math.floor(Math.random() * harborSecrets.length);
    const selectedSecret = harborSecrets[randomIndex];

    setDiscoveryMessage("");
    setSecret(selectedSecret);

    window.setTimeout(() => {
      setSecret(null);
    }, 12000);
  }

  function discoverSecret() {
    if (!secret) return;

    const newCoinCount = coinCount + 1;

    setCoinCount(newCoinCount);
    setDiscoveryMessage(secret.message);
    setSecret(null);

    window.localStorage.setItem(
      "harbor-coin-count",
      String(newCoinCount)
    );

    window.setTimeout(() => {
      setDiscoveryMessage("");
    }, 5000);
  }

  return (
    <>
      <aside className={styles.coinCounter} aria-label="Harbor discoveries">
        <span aria-hidden="true">🪙</span>
        <span>
          Harbor discoveries: <strong>{coinCount}</strong>
        </span>
      </aside>

      {secret && (
        <button
          type="button"
          className={styles.secret}
          onClick={discoverSecret}
          aria-label={`Discover ${secret.name}`}
          title={`You spotted ${secret.name}!`}
        >
          <span className={styles.secretSymbol} aria-hidden="true">
            {secret.symbol}
          </span>

          <span className={styles.secretHint}>
            What is that?
          </span>
        </button>
      )}

      {discoveryMessage && (
        <div className={styles.discoveryNotice} role="status">
          <strong>Harbor Secret Discovered!</strong>
          <span>{discoveryMessage}</span>
          <span className={styles.motto}>
            I love hanging at the Harbor!
          </span>
        </div>
      )}
    </>
  );
}