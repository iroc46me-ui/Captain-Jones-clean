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
  const [photos, setPhotos] = useState<string[]>([]);
const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
const [photosChanged, setPhotosChanged] = useState(false);
const [newPhotoPreviews, setNewPhotoPreviews] = useState<string[]>([]);

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
        setPhotos(
  [item.imageUrl, ...(item.imageUrls || [])].filter(
    (url): url is string =>
      typeof url === "string" && url.length > 0
  )
);

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
    if (saving) return;

    const cleanTitle = listing.title.trim();
    const cleanPrice = listing.price.trim();
    const cleanDescription = listing.description.trim();

    if (!cleanTitle || !cleanPrice || !cleanDescription) {
      setMessage(
        "Please complete the title, price and description."
      );
      return;
    }
const totalPhotos = photos.length + newPhotoFiles.length;

if (totalPhotos < 1 || totalPhotos > 6) {
  setMessage("A listing must have between one and six photographs.");
  return;
}
    setSaving(true);
setMessage("");

try {
  const uploadedPhotoUrls: string[] = [];

  for (let index = 0; index < newPhotoFiles.length; index++) {
    setMessage(
      `Uploading photograph ${index + 1} of ${newPhotoFiles.length}...`
    );

    const formData = new FormData();
    formData.append("file", newPhotoFiles[index]);

    const uploadResponse = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (
      !uploadResponse.ok ||
      !uploadData.success ||
      !uploadData.url
    ) {
      setMessage(
        uploadData.error ||
          `Photograph ${index + 1} could not be uploaded.`
      );
      return;
    }

    uploadedPhotoUrls.push(uploadData.url);
  }

  const finalPhotos = [...photos, ...uploadedPhotoUrls];

  if (finalPhotos.length === 0 || finalPhotos.length > 6) {
    setMessage("A listing must have between one and six photographs.");
    return;
  }

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
  ...(photosChanged || newPhotoFiles.length > 0
    ? {
        imageUrl: finalPhotos[0],
        imageUrls: finalPhotos.slice(1),
      }
    : {}),
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
              <div className="mt-5">
  {photos.length > 0 ? (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => (
        <div
          key={`${photo}-${index}`}
          className="overflow-hidden rounded-xl border border-white/20 bg-slate-950/50"
        >
          <img
            src={photo}
            alt={`Treasure photograph ${index + 1}`}
            className="aspect-square w-full object-cover"
          />
          <p className="px-2 py-2 text-center text-xs text-stone-300">
            {index === 0 ? "Main Photo" : `Photo ${index + 1}`}
          </p>
          <button
  type="button"
  disabled={index === 0}
  onClick={() => {
    setPhotos((current) => {
      const updated = [...current];
      [updated[index - 1], updated[index]] = [
        updated[index],
        updated[index - 1],
      ];
      return updated;
    });
    setPhotosChanged(true);
  }}
  className="mb-2 w-full rounded-lg border border-amber-300/30 px-3 py-2 text-sm font-semibold text-amber-200 hover:bg-amber-300/10 disabled:cursor-not-allowed disabled:opacity-30"
>
  {index === 0 ? "Main Photo" : "Move Left"}
</button>
          <button
  type="button"
  disabled={photos.length <= 1}
  onClick={() => {
    setPhotos((current) =>
      current.filter((_, photoIndex) => photoIndex !== index)
    );
    setPhotosChanged(true);
  }}
  className="mb-3 w-full rounded-lg border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-30"
>
  Remove Photo
</button>
        </div>
      ))}
    </div>
  ) : (
    <p className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm text-stone-400">
      No photographs are attached to this listing.
    </p>
  )}
  <p className="mt-4 text-xs text-stone-400">
    Up to six photographs per listing.
  </p>
  <label className="mt-4 block text-sm font-semibold text-amber-200">
  Add Replacement Photos
  <input
    type="file"
    accept="image/*"
    multiple
    disabled={photos.length >= 6}
    onChange={(event) => {
      const selected = Array.from(event.target.files || []);
      const available = 6 - photos.length - newPhotoFiles.length;

      if (selected.length > available) {
        setMessage(`You can add only ${available} more photograph(s).`);
        event.target.value = "";
        return;
      }

      setNewPhotoFiles((current) => [...current, ...selected]);
      setNewPhotoPreviews((current) => [
  ...current,
  ...selected.map((file) => URL.createObjectURL(file)),
]);
      setMessage("");
      event.target.value = "";
    }}
    className="mt-2 block w-full text-sm text-stone-300"
  />
</label>
{newPhotoPreviews.length > 0 && (
  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
    {newPhotoPreviews.map((preview, index) => (
      <div
        key={preview}
        className="overflow-hidden rounded-xl border border-amber-300/30 bg-slate-950/50"
      >
        <img
          src={preview}
          alt={`New photograph ${index + 1}`}
          className="aspect-square w-full object-cover"
        />
        <p className="px-2 py-2 text-center text-xs text-amber-200">
          New Photo {index + 1} — Not Saved
        </p>
        <button
  type="button"
  onClick={() => {
    URL.revokeObjectURL(preview);

    setNewPhotoFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index)
    );

    setNewPhotoPreviews((current) =>
      current.filter((_, previewIndex) => previewIndex !== index)
    );

    setMessage("");
  }}
  className="mb-3 w-full rounded-lg border border-red-400/30 px-3 py-2 text-sm font-semibold text-red-200 hover:bg-red-400/10"
>
  Remove Selected Photo
</button>
      </div>
    ))}
  </div>
)}
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