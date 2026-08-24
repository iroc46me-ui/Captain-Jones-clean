"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ListingForm = {
  title: string;
  price: string;
  category: string;
  condition: string;
  seller: string;
  description: string;
  shipping: string;
};

export default function EditListingPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const slug = params.slug;

  const [listing, setListing] = useState<ListingForm>({
    title: "",
    price: "",
    category: "Gold & Prospecting",
    condition: "Good",
    seller: "",
    description: "",
    shipping: "Buyer Pays Shipping",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadListing() {
      try {
        const response = await fetch("/api/listings", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ slug }),
        });

        const data = await response.json();

        if (!response.ok || !data.success || !data.listing) {
          setMessage(
            data.error || "The listing could not be loaded."
          );
          return;
        }

        const item = data.listing;

        setListing({
          title: item.title,
          price: (item.priceCents / 100).toFixed(2),
          category: item.category,
          condition: item.condition || "Good",
          seller: item.seller,
          description: item.description,
          shipping: item.shipping || "Buyer Pays Shipping",
        });
      } catch {
        setMessage("The listing could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadListing();
  }, [slug]);

  function updateField(
    field: keyof ListingForm,
    value: string
  ) {
    setListing((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveChanges(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanTitle = listing.title.trim();
    const cleanPrice = listing.price.trim();
    const cleanDescription = listing.description.trim();

    if (!cleanTitle || !cleanPrice || !cleanDescription) {
      setMessage(
        "Please complete the title, price and description."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/listings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug,
          title: cleanTitle,
          price: cleanPrice,
          category: listing.category,
          condition: listing.condition,
          description: cleanDescription,
          shipping: listing.shipping,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(
          data.error || "The listing could not be updated."
        );
        return;
      }

      router.push("/seller-chest");
      router.refresh();
    } catch {
      setMessage("The listing could not be updated.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071116] text-cyan-200">
        Loading treasure...
      </main>
    );
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
              Edit Listing
            </h1>

            <p className="mt-3 max-w-2xl leading-7 text-stone-300">
              Update this treasure&apos;s information and save
              the changes back to the Harbor.
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
        onSubmit={saveChanges}
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
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-amber-300"
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
                  inputMode="decimal"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none transition focus:border-amber-300"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-stone-300">
                  Seller
                </span>

                <input
                  value={listing.seller}
                  readOnly
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-stone-400"
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
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                rows={7}
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 leading-7 outline-none transition focus:border-amber-300"
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
                  Image Management Coming Next
                </p>

                <p className="mt-2 text-sm leading-6 text-stone-500">
                  Existing and replacement photographs will
                  be managed here.
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

                  <span className="font-semibold">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </section>

          {message && (
            <p className="rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>

          <Link
            href={`/listing/${slug}`}
            className="flex w-full justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 px-6 py-3 font-bold text-cyan-100 transition hover:bg-cyan-300/20"
          >
            View Current Listing
          </Link>
        </aside>
      </form>
    </main>
  );
}