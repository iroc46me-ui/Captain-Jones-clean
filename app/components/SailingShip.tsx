"use client";

import { motion } from "framer-motion";

export default function SailingShip() {
  return (
    <motion.img
      src="/sailing-galleon.png"
      alt=""
      aria-hidden="true"
     className="pointer-events-none absolute bottom-2 -right-24 z-10 w-56 object-contain opacity-100 brightness-150"
      initial={{
        x: 0,
        y: 0,
        scale: 1,
        opacity: 0,
      }}
      animate={{
  x: ["0vw", "-12vw", "-20vw"],
  y: [0, -4, -12],
  scale: [1, 0.82, 0.55],
  opacity: [0, 1, 0],
}}
      transition={{
        duration: 72,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: 18,
        times: [0, 0.2, 1],
      }}
    />
  );
}