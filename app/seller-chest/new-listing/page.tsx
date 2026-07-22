"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type ListingDraft = {
  title: string;
  price: string;
  category: string;
  condition: string;
  seller: string;
  description: string;
  shipping: string;
};

const EMPTY_LISTING: ListingDraft = {
  title: "",
  price: "",
  category: "Gold & Prospecting",
  condition: "Good",
  seller: "",
  description: "",
  shipping: "Buyer Pays Shipping",
};

const STORAGE_KEY = "davey-jones-published-listings";
const DRAFT_KEY = "davey-jones-listing-draft";

export default function NewListingPage() {
  const router = useRouter();
  const [listing, setListing] = useState<ListingDraft>(EMPTY_LISTING);
  const [message, setMessage] = useState("");

  function updateField(
    field: keyof ListingDraft,
    value: string
  ) {
    setListing((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function saveDraft() {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(listing));
    setMessage("Draft saved in this browser.");
  }

  function loadDraft() {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY);

      if (!savedDraft) {
        setMessage("No saved draft was found.");
        return;
      }

      setListing(JSON.parse(savedDraft));
      setMessage("Saved draft restored.");
    } catch {
      setMessage("The saved draft could not be restored.");
    }
  }

  function publishListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = listing.title.trim();
    const cleanSeller = listing.seller.trim();
    const cleanDescription = listing.description.trim();
    const cleanPrice = listing.price.trim();

    if (
      !cleanTitle ||
      !cleanSeller ||
      !cleanDescription ||
      !cleanPrice
    ) {
      setMessage(
        "Please complete the title, price, seller and description."
      );
      return;
    }

    const slug = cleanTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const publishedListing = {
      ...listing,
      title: cleanTitle,
      seller: cleanSeller,
      description: cleanDescription,
      price: cleanPrice.startsWith("$")
        ? cleanPrice
        : `$${cleanPrice}`,
      slug,
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    try {
      const existingListings = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...existingListings, publishedListing])
      );

      localStorage.setItem(
        "davey-jones-last-published-listing",
        JSON.stringify(publishedListing)
      );

      localStorage.removeItem(DRAFT_KEY);

      router.push("/seller-chest/listing-published");
    } catch {
      setMessage("The listing could not be published.");
    }
  }

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-amber-400/20 bg-gradient-to-r from-[#071116] via-[#10242c] to-[#071116]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 px-6 py-7 sm:px-10 md:flex-row md:items-end lg:px-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
              Davey Jones Junk-N-Treasure
            </p>

            <h1 className="mt-2 font-serif text-4xl font-semibold text-amber-200 sm:text-5xl">
              Create New Listing
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Add a treasure to your Seller Chest and prepare it for
              the Treasure Deck.
            </p>
          </div>

          <Link
            href="/seller-chest"
            className="inline-flex w-fit rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold transition hover:bg-white/10"
          >
            Return to Seller Chest
          </Link>
        </div>
      </section>

      <form
        onSubmit={publishListing}
        className="mx-auto grid max-w-6xl gap-6 px-6 py-8 sm:px-10 lg:grid-cols-[1fr_0.75fr] lg:px-16"
      >
        <section className="rounded-3xl border border-cyan-300/20 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Treasure Details
          </p>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="text-sm font-semibold text-stone-300">
                Item title
              </span>

              <input
                value={listing.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                placeholder="Example: Vintage Brass Ship Lantern"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition placeholder:text-stone-600 focus:border-amber-300"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-stone-300">
                  Price
                </span>

                <input
                  value={listing.price}
                  onChange={(event) =>
                    updateField("price", event.target.value)
                  }
                  placeholder="75"
                  inputMode="decimal"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition placeholder:text-stone-600 focus:border-amber-300"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-stone-300">
                  Seller name
                </span>

                <input
                  value={listing.seller}
                  onChange={(event) =>
                    updateField("seller", event.target.value)
                  }
                  placeholder="Davey's Workshop"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition placeholder:text-stone-600 focus:border-amber-300"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-stone-300">
                  Category
                </span>

                <select
                  value={listing.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:border-amber-300"
                >
                  <option>Gold & Prospecting</option>
                  <option>Antiques</option>
                  <option>Tools</option>
                  <option>RV & Auto</option>
                  <option>Collectibles</option>
                  <option>Handmade</option>
                  <option>Estate Finds</option>
                  <option>Oddities</option>
                  <option>Local Pickup</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-stone-300">
                  Condition
                </span>

                <select
                  value={listing.condition}
                  onChange={(event) =>
                    updateField("condition", event.target.value)
                  }
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:border-amber-300"
                >
                  <option>New</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Fair</option>
                  <option>For Parts or Repair</option>
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-semibold text-stone-300">
                Description
              </span>

              <textarea
                value={listing.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Describe the item, its history, measurements, defects and anything the buyer should know."
                rows={7}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 leading-7 outline-none transition placeholder:text-stone-600 focus:border-amber-300"
              />
            </label>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-300/10 to-transparent p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
              Treasure Images
            </p>

            <div className="mt-5 flex min-h-[190px] items-center justify-center rounded-2xl border border-dashed border-white/20 bg-slate-950/50 px-6 text-center">
              <div>
                <p className="font-serif text-xl text-stone-200">
                  Image Upload Coming Next
                </p>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  This area will accept multiple photographs, arrange
                  their order and select a cover image.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-cyan-300/20 bg-white/[0.04] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Delivery
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Buyer Pays Shipping",
                "Free Shipping",
                "Local Pickup",
              ].map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3"
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={listing.shipping === option}
                    onChange={() =>
                      updateField("shipping", option)
                    }
                    className="h-4 w-4"
                  />

                  <span className="font-semibold">{option}</span>
                </label>
              ))}
            </div>
          </section>

          {message && (
            <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              {message}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <button
              type="button"
              onClick={saveDraft}
              className="rounded-full border border-white/20 px-6 py-3 font-bold transition hover:bg-white/10"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={loadDraft}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 font-bold text-cyan-100 transition hover:bg-cyan-300/20"
            >
              Restore Draft
            </button>

            <button
              type="submit"
              className="rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-200 sm:col-span-2 lg:col-span-1"
            >
              Publish Listing
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
}