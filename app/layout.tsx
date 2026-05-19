import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Davey Jones Junk N Treasure | Harbor Alpha",
  description: "A cinematic lower-fee discovery marketplace for useful junk, rare finds, antiques, prospecting gear, collectibles, oddities, RV finds, and hidden treasure.",
  openGraph: {
    title: "Davey Jones Junk N Treasure",
    description: "Where forgotten things find new shores.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
