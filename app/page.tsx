"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Anchor,
  BadgeCheck,
  Camera,
  Coins,
  Crown,
  Database,
  Gem,
  ImagePlus,
  LockKeyhole,
  Menu,
  MonitorSmartphone,
  Search,
  ShieldCheck,
  ShipWheel,
  Sparkles,
  Store,
  
  UploadCloud,
  Users,
  
  X,
} from "lucide-react";

const sampleItems = [
 
   {
    title: "Vintage Brass Ship Lantern",
    slug: "vintage-brass-ship-lantern",
    price: "$68",
    category: "Antiques",
    tag: "Captain's Pick",
    seller: "Old Harbor Finds",
    description: "A weathered brass-style ship lantern with old harbor character, perfect for collectors, nautical décor, cabins, RVs, or treasure-room display.",
  },
  {
    title: "Desert Nugget Digger",
    slug: "desert-nugget-digger",
    price: "$75",
    category: "Gold & Prospecting",
    tag: "Handmade Tool",
    seller: "Davey's Workshop",
    description: "A rugged handmade prospecting tool built for scraping bedrock cracks, caliche seams, and hard-packed desert washes where gold likes to hide.",
  },
  {
    title: "Old Coin & Relic Lot",
    slug: "old-coin-relic-lot",
    price: "$42",
    category: "Collectibles",
    tag: "Treasure Bin",
    seller: "Relic Rider",
    description: "A small mystery-style relic lot with old coins, metal finds, and forgotten drawer treasures for collectors who enjoy the hunt.",
  },
  {
    title: "RV Parts Mystery Box",
    slug: "rv-parts-mystery-box",
    price: "$35",
    category: "RV & Auto",
    tag: "Useful Junk",
    seller: "Road Dog Salvage",
    description: "A useful mixed box of RV and road-life parts, hardware, fittings, and odd spares for tinkerers, travelers, and repair-minded treasure hunters.",
  },
  {
    title: "Prospector's Brass Scale",
    slug: "prospectors-brass-scale",
    price: "$58",
    category: "Gold & Prospecting",
    tag: "Field Gear",
    seller: "Quartzsite Cache",
    description: "A compact brass-style field scale made for weighing small finds, gold flakes, relics, and other tiny treasures from the trail.",
  },
  {
    title: "Estate Drawer Oddities",
    slug: "estate-drawer-oddities",
    price: "$29",
    category: "Estate Finds",
    tag: "Oddities",
    seller: "Second Drawer Co.",
    description: "A curious estate drawer bundle filled with small forgotten objects, unusual keepsakes, and conversation pieces from another life.",
  },
];
const categories = [
  "Gold & Prospecting",
  "Antiques",
  "Tools",
  "RV & Auto",
  "Collectibles",
  "Handmade",
  "Estate Finds",
  "Oddities",
  "Local Pickup",
  "Captain's Picks",
];
const categoryImages = {
  "Gold & Prospecting": "gold",
  "Antiques": "wheel",
  "RV & Auto": "compass",
  "Collectibles": "chest",
  "Handmade": "hammer",
  "Estate Finds": "scroll",
  "Oddities": "kraken",
  "Local Pickup": "anchor",
  "Captain's Picks": "flag",
}

const brandButtons = [
  "Browse Treasure",
  "Become a Seller",
  "Captain's Picks",
  "Live Treasure Drops",
  "Explore Categories",
  "Trusted Captain's Cut",
];

function LogoBust() {
  return (
    <div className="relative mx-auto flex h-48 w-48 items-center justify-center rounded-full border border-amber-300/30 bg-gradient-to-b from-slate-700 via-slate-950 to-cyan-950 shadow-2xl shadow-cyan-950/70">
      <div className="absolute inset-2 rounded-full border border-cyan-200/10" />
      <div className="absolute bottom-4 h-10 w-32 rounded-t-full bg-amber-800/90 shadow-lg" />
      <div className="absolute bottom-6 flex h-14 w-36 items-center justify-center rounded-xl border border-amber-200/40 bg-gradient-to-b from-amber-500 to-amber-950 shadow-xl"><Gem className="h-6 w-6 text-cyan-100" /></div>
      <div className="absolute bottom-20 h-20 w-24 rounded-t-3xl rounded-b-xl bg-stone-300 shadow-xl" />
      <div className="absolute bottom-[106px] h-16 w-28 rounded-full bg-stone-200" />
      <div className="absolute bottom-[132px] h-7 w-40 rounded-full bg-slate-950" />
      <div className="absolute bottom-[145px] h-7 w-28 rounded-t-full bg-red-800" />
      <div className="absolute bottom-[123px] left-[76px] h-2 w-2 rounded-full bg-slate-950" />
      <div className="absolute bottom-[123px] right-[76px] h-2 w-2 rounded-full bg-slate-950" />
      <div className="absolute bottom-[104px] h-9 w-16 rounded-b-full bg-white/90" />
      <Crown className="absolute top-4 h-9 w-9 text-amber-300" />
      <Anchor className="absolute left-5 top-16 h-8 w-8 -rotate-12 text-cyan-200/80" />
      <Coins className="absolute right-5 bottom-14 h-8 w-8 text-amber-300/90" />
    </div>
  );
}
  function Header() {
  const navLink =
    "rounded-md px-3 py-2 text-sm font-bold text-white transition hover:bg-amber-300/20 hover:text-amber-200";

  return (
    <header className="sticky top-0 z-[9999] border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="text-3xl text-amber-300">⚓</div>

        <nav className="flex overflow-x-auto items-center gap-2 text-xs">
          <a href="#join" className={navLink}>Open a Chest</a>
          <a href="#marketplace" className={navLink}>Treasure Deck</a>
          <a href="#identity" className={navLink}>The Captain&apos;s Cut</a>
          <a href="#live-events" className={navLink}>Live Events</a>
          <a href="#about" className={navLink}>About</a>
        </nav>

        <a
          href="#join"
          className="rounded-md border border-amber-400/30 bg-amber-500/10 px-5 py-2 text-sm font-bold text-amber-100 transition hover:bg-amber-500/20"
        >
          Join Harbor
        </a>
      </div>
    </header>
  );
}
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-[75vh] screen text-white flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: "url('/harbor-hero.png')",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mt-[18rem] flex justify-center gap-2">
            <a
              href="#join"
              className="-ml-1 rounded-md border border-transparent px-10 py-2 text-transparent hover:bg-amber-300/10"
            >
              Open a Seller Chest
            </a>

            <a
              href="#marketplace"
              className="rounded-md border border-transparent px-8 py-2 text-transparent hover:bg-amber-300/10"
            >
              Explore the Treasure Deck
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function LiveBanner() {
  return <section id="live-events" className="scroll-mt-24 mt-16 t16 bg-slate-950 px-4 py-4 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-200/20 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 shadow-2xl">
      <div className="grid gap-2 p-2 lg:grid-cols-[1fr_auto] lg:items-center lg:p-2"><div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500">Live Treasure Event</p>
        <h2 className="mt-1 text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white">The Captain's Midnight Treasure Drop</h2>
        <p className="mt-3 max-w-2xl text-base leading-6 text-slate-300">
          A rotating live event featuring rare listings, strange finds, collectible lots, estate discoveries, and featured sellers from around the harbor.</p></div>
        <div className="flex flex-col gap-4"><a href="#join" className="rounded-full bg-amber-300 px-8 py-4 text-center font-black text-slate-950 shadow-xl transition hover:bg-amber-200">Enter the Drop</a><a href="#join" className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-black text-white transition hover:bg-white/10">Become Featured Seller</a></div></div></div></section>;
}

function Marketplace() {
  const [query, setQuery] = useState("");
  const visibleItems = useMemo(() => sampleItems.filter((item) => `${item.title} ${item.category} ${item.seller}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <section id="marketplace" className="bg-gradient-to-b from-cyan-950 to-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div><p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Marketplace Preview</p>
          <h2 className="mt-0 text-xl font-black tracking-tight text-red-500"> Treasure by category</h2>
          <p className="mt-4 max-w-2xl text-slate-300"></p></div>
        <div className="relative mt-6 w-full md:max-w-sm">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search the Treasure deck..." className="relative -top-4 w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:border-amber-200"/></div>
      </div>
<div className="mt-2 flex flex-wrap gap-3">{categories.map((category) => <span key={category} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200">{category}</span>)}</div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{visibleItems.map((item) => 

<a
  key={item.title}
  href={`#item-${item.slug}`}
  className="group block rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-xl transition hover:border-amber-200/40 hover:bg-white/[0.09]"

>
       

 <div className="flex h-24 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-cyan-900">
          <span className="text-5xl">
  {categoryImages[item.category as keyof typeof categoryImages] === "gold" && "⛏️"}
  {categoryImages[item.category as keyof typeof categoryImages] === "wheel" && "⚙️"}
  {categoryImages[item.category as keyof typeof categoryImages] === "compass" && "🧭"}
  {categoryImages[item.category as keyof typeof categoryImages] === "chest" && "🧰"}
  {categoryImages[item.category as keyof typeof categoryImages] === "hammer" && "🔨"}
  {categoryImages[item.category as keyof typeof categoryImages] === "scroll" && "📜"}
  {categoryImages[item.category as keyof typeof categoryImages] === "kraken" && "🐙"}
  {categoryImages[item.category as keyof typeof categoryImages] === "anchor" && "⚓"}
  {categoryImages[item.category as keyof typeof categoryImages] === "flag" && "🏴‍☠️"}
</span>
</div>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">{item.tag}</p>
        <h3 className="mt-2 text-xl font-black">{item.title}</h3><div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-black text-amber-200">{item.price}</span>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-slate-300">{item.category}</span></div>
        <p className="mt-3 text-sm font-semibold text-slate-400">Seller: {item.seller}</p></a>)}</div></div></section>
  );
}

function ListingDetails() {
  return (
    <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">
          Treasure Details
        </p>

        <div className="mt-8 grid gap-6">
          {sampleItems.map((item) => (
            <div
              key={item.title}
              id={`item-${item.slug}`}
              className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl"
            >
             
     
     <div className="mb-6 flex h-40 items-center justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-900/30 to-slate-900 sm:h-56">

  <span className="text-8xl">
    {categoryImages[item.category as keyof typeof categoryImages] === "gold" && "⛏️"}
    {categoryImages[item.category as keyof typeof categoryImages] === "wheel" && "⚙️"}
    {categoryImages[item.category as keyof typeof categoryImages] === "compass" && "🧭"}
    {categoryImages[item.category as keyof typeof categoryImages] === "chest" && "🧰"}
    {categoryImages[item.category as keyof typeof categoryImages] === "hammer" && "🔨"}
    {categoryImages[item.category as keyof typeof categoryImages] === "scroll" && "📜"}
    {categoryImages[item.category as keyof typeof categoryImages] === "kraken" && "🐙"}
    {categoryImages[item.category as keyof typeof categoryImages] === "anchor" && "⚓"}
    {categoryImages[item.category as keyof typeof categoryImages] === "flag" && "🏴‍☠️"}
  </span>
</div>

<p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-200">
  {item.tag}
</p>

              <h3 className="mt-3 text-3xl font-black text-amber-200">
                {item.title}
              </h3>

              <p className="mt-3 text-2xl font-black">{item.price}</p>

              <p className="mt-4 text-slate-300">
  Seller:{" "}
  <a href={`#seller-${item.seller.replaceAll(" ", "-").toLowerCase()}`} className="font-bold text-amber-200 hover:underline">
    {item.seller}
  </a>
</p>

              <p className="mt-5 max-w-3xl leading-7 text-slate-300">
                This is an early Harbor Alpha listing preview. Full photos,
                condition notes, shipping options, seller profile, and contact
                tools will be added as the marketplace grows.
              </p>
      
    <p className="mt-6 text-slate-300">
  {item.description}
</p>

<div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
  <h3 className="text-lg font-black text-amber-200">
    Harbor Notes
  </h3>

  <ul className="mt-4 space-y-2 text-slate-300">
    <li>• Handmade Tool</li>
    <li>• Arizona Built</li>
    <li>• Small Batch Production</li>
    <li>• Ships from Seller Location</li>
  </ul>
</div>
            
  <a
     href="#join"
                className="mt-6 inline-block rounded-full bg-amber-300 px-6 py-3 font-black text-slate-950 hover:bg-amber-200"
              >
                Ask About This Treasure
              </a>
<a
  href="#marketplace"
 className="ml-3 mt-6 inline-block rounded-full border border-white/20 px-6 py-3 font-black text-white hover:bg-white/10"
>
 Back to Treasure Deck
</a>
 </div>             
  ))}
  </div>
      </div>
    </section>
  );
}

function SellerProfiles() {
  const sellers = Array.from(new Set(sampleItems.map((item) => item.seller)));

  return (
    <section id="sellers" className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">
          Harbor Sellers
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {sellers.map((seller) => (
            <div
              key={seller}
              id={`seller-${seller.replaceAll(" ", "-").toLowerCase()}`}
              className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl"
            >
       
<div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-5xl">
  {seller === "Davey's Workshop" && "⚒️"}
  {seller === "Road Dog Salvage" && "🚐"}
  {seller === "Relic Rider" && "🏺"}
  {seller === "Old Harbor Finds" && "🏮"}
  {seller === "Quartzsite Cache" && "⛏️"}
  {seller === "Second Drawer Co." && "🗃️"}
  {!["Davey's Workshop", "Road Dog Salvage", "Relic Rider", "Old Harbor Finds", "Quartzsite Cache", "Second Drawer Co."].includes(seller) && "⚓"}
</div>

              <h3 className="text-3xl font-black text-amber-200">{seller}</h3>
      <a
  href={`#harbor-${seller.replaceAll(" ", "-").toLowerCase()}`}
  className="mt-3 inline-block rounded-full border border-amber-300/30 px-4 py-2 text-sm font-black text-amber-200 hover:bg-amber-300/10"
>
  Visit Seller Harbor
</a>        
     <div className="mt-4 space-y-2 text-slate-300">
  <p>📍 Arizona</p>
  <p>⚒️ Gold Prospecting Tools & Field Equipment</p>
  <p>⭐ Trusted Harbor Seller</p>
  <p>📦 Ships Throughout the United States</p>
  <p>🏴‍☠️ Harbor Member Since 2026</p>
</div>
     <p>⭐⭐⭐⭐⭐ 5.0 Harbor Rating</p>
<p>⚡ Replies Within 24 Hours</p>
<p>🎯 Specialty: Curated Treasure Finds</p>         

<p className="mt-2 text-slate-300">
                Listings: {sampleItems.filter((item) => item.seller === seller).length}
              </p>
             
<div className="mt-6">
  <h4 className="font-black text-amber-200">
    Seller Inventory
  </h4>

  <div className="mt-3 space-y-2">
    {sampleItems
      .filter((item) => item.seller === seller)
      .map((item) => (
        <a
          key={item.title}
          href={`#item-${item.slug}`}
          className="block rounded-xl border border-white/10 bg-white/[0.04] p-3 font-bold text-white hover:bg-white/[0.08]"
        >
          {item.title} — {item.price}
        </a>
      ))}
  </div>
</div>
      
              <a
                href="#marketplace"
                className="mt-6 inline-block rounded-full border border-white/20 px-6 py-3 font-black text-white hover:bg-white/10"
              >
                View Treasure Deck
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SellerHarbors() {
  const sellers = Array.from(new Set(sampleItems.map((item) => item.seller)));

  return (
    <section id="seller-harbors" className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">
          Seller Harbors
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-amber-200 sm:text-5xl">
          Storefronts inside the Harbor
        </h2>

        <div className="mt-10 grid gap-8">
          {sellers.map((seller) => (
            <div
              key={seller}
              id={`harbor-${seller.replaceAll(" ", "-").toLowerCase()}`}
              className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl"
            >
              <h3 className="text-3xl font-black text-amber-200">{seller}</h3>

              <p className="mt-4 max-w-3xl text-slate-300">
                This seller harbor is a storefront preview for {seller}. Full seller stories,
                photos, ratings, policies, and verified inventory will be added as the marketplace grows.
              </p>

              <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                <h4 className="font-black text-amber-200">Current Harbor Inventory</h4>

                <div className="mt-4 space-y-3">
                  {sampleItems
                    .filter((item) => item.seller === seller)
                    .map((item) => (
                      <a
                        key={item.title}
                        href={`#item-${item.slug}`}
                        className="block rounded-xl border border-white/10 bg-white/[0.04] p-4 font-bold text-white hover:bg-white/[0.08]"
                      >
                        {item.title} — {item.price}
                      </a>
                    ))}
                </div>
              </div>

              <a
                href="#sellers"
                className="mt-6 inline-block rounded-full border border-white/20 px-6 py-3 font-black text-white hover:bg-white/10"
              >
                Back to Seller Profiles
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MessageBottles() {
  return (
    <section id="message-bottle" className="scroll-mt-24 bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">
          Message Bottles
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-amber-200 sm:text-5xl">
          Send a Bottle across the Harbor.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          Ask a seller about a treasure without leaving the Harbor. Buyer and seller information stays private until purchase.
        </p>

        <div className="mt-8 grid gap-4">
          <input
            placeholder="To: Seller name"
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder:text-slate-500 outline-none focus:border-amber-200"
          />

          <input
            placeholder="Regarding: Treasure listing"
            className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder:text-slate-500 outline-none focus:border-amber-200"
          />

          <textarea
            placeholder="Write your message bottle..."
            className="min-h-40 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-4 text-white placeholder:text-slate-500 outline-none focus:border-amber-200"
          />
        </div>

        <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 text-slate-200">
          <h3 className="font-black text-amber-200">Harbor Communication Rules</h3>
          <ul className="mt-4 space-y-2">
            <li>⚓ All buyer-seller communication stays inside Harbor before purchase.</li>
            <li>⚓ No phone numbers, emails, outside payment links, or social handles before purchase.</li>
            <li>⚓ Buyer and seller information remains private until the transaction is completed.</li>
            <li>⚓ Harbor provides the message channel, but does not guarantee items, payments, delivery, or outcomes.</li>
          </ul>
        </div>

        <button className="mt-6 rounded-full bg-amber-300 px-8 py-4 font-black text-slate-950 hover:bg-amber-200">
          Send Bottle
        </button>
      </div>
    </section>
  );
}

function HarborRules() {
  return (
    <section id="harbor-rules" className="scroll-mt-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">
          Harbor Code
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          The rules that keep the Harbor safe.
        </h2>

        <div className="mt-8 space-y-5 text-slate-300">
          <p>⚓ All buyer and seller communication must remain inside Harbor until purchase is completed.</p>
          <p>⚓ No phone numbers, emails, payment links, social handles, or outside contact information before purchase.</p>
          <p>⚓ Buyer and seller information remains private until a transaction is completed.</p>
          <p>⚓ Davey Jones Junk N Treasure provides marketplace, listing, and communication tools only.</p>
          <p>⚓ Sellers are responsible for item condition, accuracy, shipping, pickup, fulfillment, and seller policies.</p>
          <p>⚓ Buyers are responsible for reading listings, asking questions, and understanding what they purchase.</p>
          <p>⚓ Harbor does not guarantee item authenticity, condition, delivery, refunds, payment outcomes, or seller claims.</p>
          <p>⚓ Harbor may remove listings, sellers, buyers, or messages that violate the Harbor Code.</p>
        </div>

        <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
          <h3 className="font-black text-amber-200">
            Captain’s Note
          </h3>
          <p className="mt-3 text-slate-200">
            This is an early Harbor Alpha rules draft. Formal legal terms, privacy policy,
            payment rules, refund language, and prohibited item policies will be developed before public launch.
          </p>
        </div>
      </div>
    </section>
  );
}

function SafeHarbor() {
  return (
    <section
      id="safe-harbor"
      className="scroll-mt-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl">

        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">
          Safe Harbor
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-amber-200 sm:text-5xl">
          The Harbor rejects certain cargo.
        </h2>

        <div className="mt-8 space-y-5 text-slate-300">

          <p>⚓ Stolen property and fraudulent listings.</p>

          <p>⚓ Counterfeit goods and copyright violations.</p>

          <p>⚓ Illegal items and prohibited materials.</p>

          <p>⚓ Dangerous chemicals and hazardous substances.</p>

          <p>⚓ Adult material and exploitative content.</p>

          <p>⚓ Scam listings, deceptive practices, and misrepresentation.</p>

          <p>⚓ Harassment, threats, and abusive behavior.</p>

          <p>⚓ Attempts to bypass Harbor communication and payment systems.</p>

        </div>

        <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
          <h3 className="font-black text-amber-200">
            Harbor Master's Authority
          </h3>

          <p className="mt-3 text-slate-200">
            Davey Jones Junk N Treasure reserves the right to remove
            listings, messages, buyers, sellers, or entire harbors that
            threaten the safety and integrity of the Harbor.
          </p>
        </div>

      </div>
    </section>
  );
}


function CaptainsPromise() {
  return (
    <section
      id="captains-promise"
      className="scroll-mt-24 bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">
          Captain’s Promise
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          We protect the crew before the trade.
        </h2>

        <div className="mt-8 space-y-5 text-slate-300">
          <p>⚓ Buyer and seller contact information stays private before purchase.</p>
          <p>⚓ Harbor messages remain inside the site to protect both sides.</p>
          <p>⚓ Payment details are handled through secure payment providers, not stored openly by Harbor.</p>
          <p>⚓ Seller payout information should be handled by approved payment systems, not manually collected by Harbor.</p>
          <p>⚓ Harbor may review messages or listings when safety, fraud, or rule violations are suspected.</p>
          <p>⚓ Personal information should only be released when needed to complete a paid transaction.</p>
        </div>

        <div className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-cyan-300/10 p-6">
          <h3 className="font-black text-cyan-200">
            Privacy Note
          </h3>

          <p className="mt-3 text-slate-200">
            This is an early privacy promise for Harbor Alpha. A formal privacy policy
            will be written before public launch.
          </p>
        </div>
      </div>
    </section>
  );
}


function HarborFees() {
  return (
    <section
      id="harbor-fees"
      className="scroll-mt-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl">

        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">
          Harbor Fees
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-amber-200 sm:text-5xl">
          No surprises. No hidden reefs.
        </h2>

        <div className="mt-8 space-y-5 text-slate-300">

          <p>
            ⚓ Harbor keeps a simple percentage from completed sales.
          </p>

          <p>
            ⚓ Sellers receive the remainder through approved payment systems.
          </p>

          <p>
            ⚓ No listing fees during Harbor Alpha.
          </p>

          <p>
            ⚓ Premium seller features may be offered in future voyages.
          </p>

          <p>
            ⚓ Fees help support fraud prevention, development, and Harbor operations.
          </p>

        </div>

        <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">

          <h3 className="font-black text-amber-200">
            Harbor Master's Lantern
          </h3>

          <p className="mt-3 text-slate-200">
            Treasure belongs to those who discover it.
            Harbor merely keeps the lanterns lit.
          </p>

        </div>

      </div>
    </section>
  );
}

function ShippingReturns() {
  return (
    <section
      id="shipping-returns"
      className="scroll-mt-24 bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">
          Shipping & Returns
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Every seller ships their own cargo.
        </h2>

        <div className="mt-8 space-y-5 text-slate-300">
          <p>⚓ Harbor does not own, store, inspect, pack, or ship seller items.</p>
          <p>⚓ Sellers are responsible for accurate descriptions, item condition, packaging, shipping, pickup, and fulfillment.</p>
          <p>⚓ Buyers should review listings carefully and ask questions through Message Bottles before purchase.</p>
          <p>⚓ Shipping costs, pickup options, timelines, and return policies are set by the individual seller unless Harbor later creates site-wide rules.</p>
          <p>⚓ Harbor does not issue refunds directly unless a future payment policy specifically allows it.</p>
          <p>⚓ Disputes may be reviewed by Harbor when fraud, misrepresentation, or Harbor Code violations are suspected.</p>
        </div>

        <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
          <h3 className="font-black text-amber-200">
            Captain’s Reminder
          </h3>

          <p className="mt-3 text-slate-200">
            Ask before you buy. Every treasure has a story, and every voyage should begin with clear expectations.
          </p>
        </div>
      </div>
    </section>
  );
}

function HarborReputation() {
  return (
    <section
      id="harbor-reputation"
      className="scroll-mt-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl">

        <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-200">
          Harbor Reputation
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-amber-200 sm:text-5xl">
          Trust is treasure.
        </h2>

        <div className="mt-8 space-y-5 text-slate-300">

          <p>
            ⭐ Harbor Reputation is earned through honesty, communication, and successful voyages.
          </p>

          <p>
            ⭐ Buyers may someday leave ratings, reviews, and notes about their experience.
          </p>

          <p>
            ⭐ Response times, completed sales, and repeat customers help build a seller's standing.
          </p>

          <p>
            ⭐ Harbor recognizes Trusted Harbor Sellers, Captain's Picks, and Featured Captains.
          </p>

          <p>
            ⭐ Reputation takes time to earn and can be lost through dishonesty or Harbor Code violations.
          </p>

        </div>

        <div className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">

          <h3 className="font-black text-amber-200">
            Harbor Master's Wisdom
          </h3>

          <p className="mt-3 text-slate-200">
            A good reputation is worth more than gold.
            The Harbor remembers honest sailors.
          </p>

        </div>

      </div>
    </section>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">{eyebrow}</p>
    <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{title}</h2>{children}</div></section>;
}

function Cards({ items }: { items: [string, string, React.ReactNode?][] }) {
  return <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map(([title, text, icon]) => 
    <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-xl">{icon}
      <h3 className="mt-2 text-lg font-black text-amber-200">{title}</h3><p className="mt-2 leading-5 text-slate-300">{text}</p></div>)}</div>;
}

function IdentityAndBuild() {
  const tech = [["Frontend", "React/Next.js for the public site, marketplace pages, seller dashboard, admin panel, and mobile layout.", <MonitorSmartphone className="h-9 w-9 text-amber-200" key="a" />], ["Database", "PostgreSQL through Supabase or Neon for users, sellers, listings, images, orders, messages, and moderation.", <Database className="h-9 w-9 text-amber-200" key="b" />], ["Login System", "Supabase Auth, Clerk, or Auth.js for buyers, sellers, admins, dashboards, and permissions.", <LockKeyhole className="h-9 w-9 text-amber-200" key="c" />], ["Image Uploads", "Cloudinary, Supabase Storage, or S3-compatible storage for product photos and homepage artwork.", <UploadCloud className="h-9 w-9 text-amber-200" key="d" />], ["Payments", "Stripe Connect first for marketplace payment splitting and seller payouts; PayPal Commerce later.", <Gem className="h-9 w-9 text-amber-200" key="e" />], ["Admin Control", "Moderation queue, listing approval, seller flags, disputes, refunds, and prohibited item controls.", <ShieldCheck className="h-9 w-9 text-amber-200" key="f" />]] as [string,string,React.ReactNode][];
  return <><Section id="identity" eyebrow="Official Identity System" title="The permanent h-40face of the harbor."><p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">A cinematic maritime marketplace identity built around discovery, mystery, forgotten valuables, and trustworthy seller culture.</p><div className="mt-8 flex flex-wrap gap-4">{brandButtons.map((button) => <button key={button} className="rounded-full border border-amber-200/20 bg-gradient-to-br from-slate-950 to-cyan-950 px-6 py-4 font-black text-amber-100 shadow-xl transition hover:scale-[1.03] hover:border-amber-200/40">{button}</button>)}</div></Section><Section id="build" eyebrow="Marketplace V2 Build Plan" title="The real engine underneath the Treasure deck."><Cards items={tech} /></Section></>;
}

function SellerInviteForm() {
  return <section id="join" className="scroll-mt-24 bg-gradient-to-b from-cyan-950 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl lg:p-12"><p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Seller Harbor Intake</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Apply to become an early harbor seller.</h2><p className="mt-5 text-lg leading-8 text-slate-300">During Harbor Alpha, sellers are curated carefully to help establish trust, atmosphere, quality listings, and discovery culture.</p><div className="mt-10 grid gap-5 md:grid-cols-2"><input placeholder="Full name or seller name" className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200" /><input placeholder="Email address" className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200" /><input placeholder="What do you primarily sell?" className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200" /><input placeholder="Website or social media (optional)" className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200" /><textarea placeholder="Tell the harbor about your Treasure, story, or specialties..." className="min-h-40 rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200 md:col-span-2" /></div><div className="mt-8 flex flex-col gap-4 sm:flex-row"><button className="rounded-full bg-amber-300 px-8 py-4 font-black text-slate-950 shadow-xl transition hover:bg-amber-200">Submit Harbor Application</button><button className="rounded-full border border-white/15 bg-white/5 px-8 py-4 font-black text-white transition hover:bg-white/10">Learn About Seller Benefits</button></div></div></section>;
}
function About() {
  return (
    <section id="about" className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">
          About the Harbor
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
          Built for useful junk, rare finds, and honest treasure.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          Davey Jones Junk N Treasure is a harbor-style marketplace for sellers, collectors,
          prospectors, estate finds, handmade tools, RV parts, oddities, and stories worth keeping.
        </p>

        <p className="mt-4 text-lg leading-8 text-slate-300">
          The goal is simple: lower fees, real sellers, trusted listings, and a marketplace with
          character instead of a cold corporate catalog.
        </p>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-4 py-10 text-center text-sm text-slate-400">
      © {new Date().getFullYear()} Davey Jones Junk N Treasure
    </footer>
  );
}


export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-white">
      <Header />
      <Hero />
      <LiveBanner />
      <Marketplace />
      <ListingDetails/>
      <SellerProfiles/>
      <SellerHarbors/>
      <MessageBottles/>
      <HarborRules/>
      <SafeHarbor/>
      <CaptainsPromise/>
      <HarborFees/>
      <ShippingReturns/>
      <HarborReputation/>
      <IdentityAndBuild/>
      <SellerInviteForm/>
      <About/>
      <Footer/>
    </div>
  );
}
