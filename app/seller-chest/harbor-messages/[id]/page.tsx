    "use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type HarborMessage = {
  id: string;
  senderType: string;
  body: string;
  flagged: boolean;
  createdAt: string;
};

type HarborInquiry = {
  id: string;
  buyerName: string;
  status: string;
  createdAt: string;
  listingTitle: string;
  listingSlug: string;
  seller: string;
};

export default function HarborConversationPage() {
  const params = useParams<{ id: string }>();
  const inquiryId = params.id;

  const [inquiry, setInquiry] = useState<HarborInquiry | null>(null);
  const [messages, setMessages] = useState<HarborMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reply, setReply] = useState("");
const [sendingReply, setSendingReply] = useState(false);
const [replyStatus, setReplyStatus] = useState("");

  useEffect(() => {
    async function loadConversation() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(
          `/api/harbor-inquiries?id=${encodeURIComponent(inquiryId)}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Harbor conversation could not be loaded."
          );
        }

        setInquiry(data.inquiry);
        setMessages(data.messages || []);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Harbor conversation could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    }

    loadConversation();
  }, [inquiryId]);
async function sendReply() {
  if (!reply.trim()) {
    setReplyStatus("Write a reply before sending.");
    return;
  }

  try {
    setSendingReply(true);
    setReplyStatus("");

    const response = await fetch("/api/harbor-inquiries", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inquiryId,
        message: reply,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      setReplyStatus(
        data.error || "The Harbor reply could not be sent."
      );
      return;
    }

    setMessages((current) => [
      ...current,
      data.message,
    ]);

    setReply("");
    setReplyStatus("⚓ Reply sent into the Harbor.");
  } catch {
    setReplyStatus("The Harbor reply could not be sent.");
  } finally {
    setSendingReply(false);
  }
}
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071116] text-cyan-200">
        Loading Harbor conversation...
      </main>
    );
  }

  if (loadError || !inquiry) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#071116] px-6 text-stone-100">
        <div className="max-w-xl rounded-3xl border border-red-400/30 bg-red-400/10 p-8 text-center">
          <p>{loadError || "Harbor conversation not found."}</p>

          <Link
            href="/seller-chest/harbor-messages"
            className="mt-6 inline-flex rounded-full border border-white/20 px-5 py-2.5 font-bold"
          >
            Return to Harbor Messages
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#071116] text-stone-100">
      <section className="border-b border-cyan-300/20 bg-gradient-to-r from-[#071116] via-[#10242c] to-[#071116]">
        <div className="mx-auto max-w-4xl px-6 py-8 sm:px-10 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Harbor Conversation
          </p>

          <h1 className="mt-2 font-serif text-4xl text-amber-200">
            {inquiry.listingTitle}
          </h1>

          <p className="mt-3 text-stone-300">
            Conversation with {inquiry.buyerName}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/seller-chest/harbor-messages"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-bold"
            >
              Return to Harbor Messages
            </Link>

            <Link
              href={`/listing/${inquiry.listingSlug}`}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-5 py-2.5 text-sm font-bold text-cyan-100"
            >
              View Listing
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-8 sm:px-10 lg:px-16">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-2xl rounded-3xl border p-5 ${
                message.senderType === "SELLER"
                  ? "ml-auto border-amber-300/30 bg-amber-300/10"
                  : "border-cyan-300/20 bg-white/[0.04]"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400">
                {message.senderType === "SELLER"
                  ? "Seller"
                  : inquiry.buyerName}
              </p>

              <p className="mt-2 leading-7 text-stone-100">
                {message.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-amber-300/20 bg-white/[0.04] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
            Seller Reply
          </p>

          <textarea
            rows={5}
            placeholder="Write a reply to the buyer..."
            value={reply}
onChange={(event) => setReply(event.target.value)}
            className="mt-4 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 outline-none"
          />

          <button
  type="button"
  onClick={sendReply}
  disabled={sendingReply}
  className="mt-4 rounded-full bg-amber-300 px-6 py-3 font-bold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
>
  {sendingReply ? "Sending..." : "Send Reply"}
</button>
{replyStatus && (
  <p className="mt-3 text-sm text-amber-100">
    {replyStatus}
  </p>
)}
        </div>
      </section>
    </main>
  );
}