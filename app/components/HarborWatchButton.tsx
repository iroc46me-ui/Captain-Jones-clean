"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type HarborWatchItem = {
  title: string;
  slug: string;
  price: string;
  category?: string;
  seller?: string;
};

type HarborWatchButtonProps = {
  item: HarborWatchItem;
};

const STORAGE_KEY = "davey-jones-harbor-watch";

export default function HarborWatchButton({
  item,
}: HarborWatchButtonProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedItems = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      ) as HarborWatchItem[];

      setIsWatching(
        savedItems.some((savedItem) => savedItem.slug === item.slug)
      );
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setIsWatching(false);
    }

    setIsReady(true);
  }, [item.slug]);

  function toggleHarborWatch(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();
    event.stopPropagation();

    try {
      const savedItems = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      ) as HarborWatchItem[];

      const alreadyWatching = savedItems.some(
        (savedItem) => savedItem.slug === item.slug
      );

      const updatedItems = alreadyWatching
        ? savedItems.filter(
            (savedItem) => savedItem.slug !== item.slug
          )
        : [...savedItems, item];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedItems)
      );

      setIsWatching(!alreadyWatching);

      window.dispatchEvent(
        new CustomEvent("harbor-watch-updated")
      );
    } catch (error) {
      console.error("Harbor Watch could not be updated:", error);
    }
  }

  const label = isWatching
    ? "Remove from Harbor Watch"
    : "Add to Harbor Watch";

  return (
    <button
      type="button"
      onClick={toggleHarborWatch}
      aria-label={label}
      aria-pressed={isWatching}
      title={label}
      className={`
        group
        absolute
        right-3
        top-3
        z-20
        rounded-full
        border
        p-1.5
        backdrop-blur-sm
        transition-all
        duration-300
        hover:scale-110
        ${
          isWatching
            ? "border-amber-300 bg-amber-300/20 shadow-lg shadow-amber-300/40"
            : "border-amber-400/30 bg-black/45 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-400/20"
        }
      `}
    >
      <Image
        src="/harbor-watch-diver.png"
        alt=""
        width={42}
        height={42}
        className={`
          transition-all
          duration-300
          ${
            isWatching
              ? "scale-105 drop-shadow-[0_0_8px_rgba(252,211,77,0.8)]"
              : "group-hover:rotate-2"
          }
          ${isReady ? "opacity-100" : "opacity-60"}
        `}
      />

      <span className="sr-only">{label}</span>
    </button>
  );
}