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
  { title: "Vintage Brass Ship Lantern", price: "$68", category: "Antiques", tag: "Captain's Pick", seller: "Old Harbor Finds" },
  { title: "Desert Nugget Digger", price: "$75", category: "Gold & Prospecting", tag: "Handmade Tool", seller: "Davey's Workshop" },
  { title: "Old Coin & Relic Lot", price: "$42", category: "Collectibles", tag: "Treasure Bin", seller: "Relic Rider" },
  { title: "RV Parts Mystery Box", price: "$35", category: "RV & Auto", tag: "Useful Junk", seller: "Road Dog Salvage" },
];

const categories = ["Gold & Prospecting", "Antiques", "Tools", "RV & Auto", "Collectibles", "Handmade", "Estate Finds", "Oddities", "Local Pickup", "Captain's Picks"];
const brandButtons = ["Browse Treasure", "Become a Seller", "Captain's Picks", "Live Treasure Drops", "Explore Categories", "Trusted Captains", "Join the Harbor", "Request Seller Invite"];

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
  const links = ["Marketplace", "Sell", "Drops", "Identity", "Build", "Join"];

  return (
    <header className="sticky top-0 z-[9999] border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 sm:px-6 lg:px-8">
    <div className="flex items-center gap-3">
    <span className="text-3xl text-amber-300">⚓</span>

   
  </div>

  <nav className="relative z-[10000] hidden md:flex items-center gap-8 pointer-events-auto bg-red-500">
  <a
    href="#live-events"
    className="relative z-[10000] pointer-events-auto rounded-md px-2 py-1 text-sm text-slate-200 transition-all hover:bg-amber-300/20 hover:text-amber-200 hover:underline cursor-pointer"
  >
    Live Test
  </a>

  <a
    href="#marketplace"
    className="relative z-[10000] pointer-events-auto text-sm text-slate-200 hover:text-amber-300 cursor-pointer"
  >
    Treasure Deck
  </a>

  <a
    href="#about"
    className="relative z-[10000] pointer-events-auto text-sm text-slate-200 hover:text-amber-300 cursor-pointer"
  >
    About
  </a>
</nav>

  <a
    href="#join"
    className="rounded-md border border-amber-400/30 bg-amber-500/10 px-5 py-2 text-sm text-amber-100 hover:bg-amber-500/20 transition-all duration-300"
  >
    Join Harbor
  </a>

</div>
    </header>
  );
}
function Hero() {
  const slogans = ["Not All Treasure Is Buried.", "Where Forgotten Things Find New Shores.", "Real Treasure. Real Sellers. Real Stories."];
  return (
    <section id="home" className="relative min-h-screen text-white flex items-center justify-center"
      style={{ 
      backgroundImage: "url('/harbor-hero.png')", backgroundSize: "cover", backgroundPosition: "center top", backgroundRepeat: "no-repeat",
    }}>
      
      <div className="absolute inset-O bg black/35 pointer-events-none"/> 
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 text-center lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          
        </motion.div>
      </div>
    </section>
    );
}

function LiveBanner() {
  return <section id="live-events" className="scroll-mt-24 bg-slate-950 px-4 py-4 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-amber-200/20 bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 shadow-2xl">
      <div className="grid gap-3 p-3 lg:grid-cols-[1fr_auto] lg:items-center lg:p-4"><div>
        <p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Live Treasure Event</p>
        <h2 className="mt-3 text-4xl font-black tracking-tight">The Captain's Midnight Treasure Drop</h2>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">A rotating live event featuring rare listings, strange finds, collectible lots, estate discoveries, and featured sellers from around the harbor.</p></div><div className="flex flex-col gap-4"><a href="#join" className="rounded-full bg-amber-300 px-8 py-4 text-center font-black text-slate-950 shadow-xl transition hover:bg-amber-200">Enter the Drop</a><a href="#join" className="rounded-full border border-white/15 bg-white/5 px-8 py-4 text-center font-black text-white transition hover:bg-white/10">Become Featured Seller</a></div></div></div></section>;
}

function Marketplace() {
  const [query, setQuery] = useState("");
  const visibleItems = useMemo(() => sampleItems.filter((item) => `${item.title} ${item.category} ${item.seller}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <section id="marketplace" className="bg-gradient-to-b from-cyan-950 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Marketplace Preview</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Treasure by category</h2><p className="mt-4 max-w-2xl text-slate-300">Start broad, then expand into seller stores, auctions, local pickup, shipping, featured listings, and verified gold or collectible sections.</p></div><div className="relative w-full md:max-w-sm"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the Treasure deck..." className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-12 pr-4 text-white placeholder:text-slate-400 outline-none focus:border-amber-200" /></div></div><div className="mt-10 flex flex-wrap gap-3">{categories.map((category) => <span key={category} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-200">{category}</span>)}</div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{visibleItems.map((item) => <div key={item.title} className="group rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-xl transition hover:-translate-y-1 hover:bg-white/[0.09]"><div className="flex h-40 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-cyan-900"><Gem className="h-16 w-16 text-amber-200 transition group-hover:scale-110" /></div><p className="mt-5 text-xs font-black uppercase tracking-[0.22em] text-cyan-200">{item.tag}</p><h3 className="mt-2 text-xl font-black">{item.title}</h3><div className="mt-4 flex items-center justify-between"><span className="text-2xl font-black text-amber-200">{item.price}</span><span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-slate-300">{item.category}</span></div><p className="mt-3 text-sm font-semibold text-slate-400">Seller: {item.seller}</p></div>)}</div></div></section>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return <section id={id} className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">{eyebrow}</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{title}</h2>{children}</div></section>;
}

function Cards({ items }: { items: [string, string, React.ReactNode?][] }) {
  return <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{items.map(([title, text, icon]) => <div key={title} className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 shadow-xl">{icon}<h3 className="mt-4 text-2xl font-black text-amber-200">{title}</h3><p className="mt-4 leading-7 text-slate-300">{text}</p></div>)}</div>;
}

function IdentityAndBuild() {
  const tech = [["Frontend", "React/Next.js for the public site, marketplace pages, seller dashboard, admin panel, and mobile layout.", <MonitorSmartphone className="h-9 w-9 text-amber-200" key="a" />], ["Database", "PostgreSQL through Supabase or Neon for users, sellers, listings, images, orders, messages, and moderation.", <Database className="h-9 w-9 text-amber-200" key="b" />], ["Login System", "Supabase Auth, Clerk, or Auth.js for buyers, sellers, admins, dashboards, and permissions.", <LockKeyhole className="h-9 w-9 text-amber-200" key="c" />], ["Image Uploads", "Cloudinary, Supabase Storage, or S3-compatible storage for product photos and homepage artwork.", <UploadCloud className="h-9 w-9 text-amber-200" key="d" />], ["Payments", "Stripe Connect first for marketplace payment splitting and seller payouts; PayPal Commerce later.", <Gem className="h-9 w-9 text-amber-200" key="e" />], ["Admin Control", "Moderation queue, listing approval, seller flags, disputes, refunds, and prohibited item controls.", <ShieldCheck className="h-9 w-9 text-amber-200" key="f" />]] as [string,string,React.ReactNode][];
  return <><Section id="identity" eyebrow="Official Identity System" title="The permanent face of the harbor."><p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">A cinematic maritime marketplace identity built around discovery, mystery, forgotten valuables, and trustworthy seller culture.</p><div className="mt-8 flex flex-wrap gap-4">{brandButtons.map((button) => <button key={button} className="rounded-full border border-amber-200/20 bg-gradient-to-br from-slate-950 to-cyan-950 px-6 py-4 font-black text-amber-100 shadow-xl transition hover:scale-[1.03] hover:border-amber-200/40">{button}</button>)}</div></Section><Section id="build" eyebrow="Marketplace V2 Build Plan" title="The real engine underneath the Treasure deck."><Cards items={tech} /></Section></>;
}

function SellerInviteForm() {
  return <section id="join" className="bg-gradient-to-b from-cyan-950 to-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl lg:p-12"><p className="text-sm font-black uppercase tracking-[0.3em] text-amber-200">Seller Harbor Intake</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Apply to become an early harbor seller.</h2><p className="mt-5 text-lg leading-8 text-slate-300">During Harbor Alpha, sellers are curated carefully to help establish trust, atmosphere, quality listings, and discovery culture.</p><div className="mt-10 grid gap-5 md:grid-cols-2"><input placeholder="Full name or seller name" className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200" /><input placeholder="Email address" className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200" /><input placeholder="What do you primarily sell?" className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200" /><input placeholder="Website or social media (optional)" className="rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200" /><textarea placeholder="Tell the harbor about your Treasure, story, or specialties..." className="min-h-40 rounded-2xl border border-white/10 bg-slate-950 px-5 py-4 text-white outline-none focus:border-amber-200 md:col-span-2" /></div><div className="mt-8 flex flex-col gap-4 sm:flex-row"><button className="rounded-full bg-amber-300 px-8 py-4 font-black text-slate-950 shadow-xl transition hover:bg-amber-200">Submit Harbor Application</button><button className="rounded-full border border-white/15 bg-white/5 px-8 py-4 font-black text-white transition hover:bg-white/10">Learn About Seller Benefits</button></div></div></section>;
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
    </div>
  );
}
