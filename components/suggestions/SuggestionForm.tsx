"use client";

import { useState } from "react";

type Segment = { id: string; name: string; slug: string };

export function SuggestionForm({
  segments,
  onSuccess,
}: {
  segments: Segment[];
  onSuccess?: () => void;
}) {
  const [segmentSlug, setSegmentSlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!segmentSlug || !title.trim() || !authorEmail.trim()) {
      setMessage({ type: "error", text: "Izberite kategorijo, vnesite naslov in e-pošto." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segmentSlug,
          title: title.trim(),
          description: description.trim(),
          authorEmail: authorEmail.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "error", text: data?.error ?? "Napaka pri pošiljanju." });
        setSubmitting(false);
        return;
      }
      setMessage({ type: "ok", text: "Predlog je bil poslan. Po odobritvi ga bo admin prikazal na seznamu." });
      setTitle("");
      setDescription("");
      setSegmentSlug("");
      setAuthorEmail("");
      onSuccess?.();
    } catch {
      setMessage({ type: "error", text: "Napaka pri pošiljanju." });
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="border-0 bg-transparent p-0 shadow-none">
      <p className="mb-4 text-sm text-slate-600">
        Vaš predlog bo po pregledu s strani administratorja prikazan na seznamu (če bo odobren).
      </p>
      {message && (
        <p
          className={`mb-4 rounded-lg px-3 py-2 text-sm ${message.type === "ok" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}
          role="alert"
        >
          {message.text}
        </p>
      )}
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Kategorija *</span>
          <select
            value={segmentSlug}
            onChange={(e) => setSegmentSlug(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
          >
            <option value="">— Izberite kategorijo —</option>
            {segments.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Naslov *</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
            placeholder="Kratek naslov predloga"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Opis</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
            placeholder="Opis predloga (opcijsko)"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Vaš e-poštni naslov *</span>
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
            placeholder="ime@example.com"
          />
        </label>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[var(--slovenia-blue)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Pošiljanje …" : "Pošlji predlog"}
        </button>
      </div>
    </form>
  );
}
