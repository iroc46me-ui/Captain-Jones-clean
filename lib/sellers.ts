export type Seller = {
  id: string;
  name: string;
  icon: string;
  location: string;
  specialty: string;
  category: string;
  rating: string;
  response: string;
  memberSince: string;
  listings: number;
  stripeAccountId: string | null;
  inventory: {
    title: string;
    price: string;
    href: string;
  }[];
};

export const sellers: Seller[] = [
  {
    id: "old-harbor-finds",
    name: "Old Harbor Finds",
    icon: "🏮",
    location: "Arizona",
    specialty: "Curated Treasure Finds",
    category: "Gold Prospecting Tools & Field Equipment",
    rating: "5.0 Harbor Rating",
    response: "Replies Within 24 Hours",
    memberSince: "Harbor Member Since 2026",
    listings: 1,
    stripeAccountId: null,
    inventory: [
      {
        title: "Vintage Brass Ship Lantern",
        price: "$68",
        href: "/listing/vintage-brass-ship-lantern",
      },
    ],
  },
  {
    id: "daveys-workshop",
    name: "Davey's Workshop",
    icon: "⚒️",
    location: "Arizona",
    specialty: "Curated Treasure Finds",
    category: "Gold Prospecting Tools & Field Equipment",
    rating: "5.0 Harbor Rating",
    response: "Replies Within 24 Hours",
    memberSince: "Harbor Member Since 2026",
    listings: 1,
    stripeAccountId: "acct_1U6f1KAP0ztOQFEL",
    inventory: [
      {
        title: "Desert Nugget Digger",
        price: "$75",
        href: "/listing/desert-nugget-digger",
      },
    ],
  },
];

export function getSellerById(id: string) {
  return sellers.find((seller) => seller.id === id);
}