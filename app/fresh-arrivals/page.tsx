import FeaturedMarketplace from "../components/FeaturedMarketplace";

const freshItems = [
  {
    title: "Vintage Brass Ship Lantern",
    price: "$68",
    tag: "Captain's Pick",
    seller: "Old Harbor Finds",
    description:
      "A weathered brass-style ship lantern with old harbor character, perfect for collectors, nautical décor, cabins, RVs, or treasure-room display.",
  },
  {
    title: "Desert Nugget Digger",
    price: "$75",
    tag: "Handmade Tool",
    seller: "Davey's Workshop",
    description:
      "A rugged handmade prospecting tool built for scraping bedrock cracks, caliche seams, and hard-packed desert washes where gold likes to hide.",
  },
  {
    title: "Old Coin & Relic Lot",
    price: "$42",
    tag: "Treasure Bin",
    seller: "Relic Rider",
    description:
      "A small mystery-style relic lot with old coins, metal finds, and forgotten drawer treasures for collectors who enjoy the hunt.",
  },
  {
    title: "RV Parts Mystery Box",
    price: "$35",
    tag: "Useful Junk",
    seller: "Road Dog Salvage",
    description:
      "A useful mixed box of RV and road-life parts, hardware, fittings, and odd spares for tinkerers, travelers, and repair-minded treasure hunters.",
  },
  {
    title: "Prospector's Brass Scale",
    price: "$58",
    tag: "Field Gear",
    seller: "Quartzsite Cache",
    description:
      "A compact brass-style field scale made for weighing small finds, gold flakes, relics, and other tiny treasures from the trail.",
  },
];

export default function FreshArrivalsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      <FeaturedMarketplace items={freshItems} />
    </main>
  );
}