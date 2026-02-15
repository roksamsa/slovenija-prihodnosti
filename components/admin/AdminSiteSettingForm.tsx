"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminSiteSettingForm({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/site-setting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <textarea
        className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
        rows={6}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Besedilo izjave o omejitvi odgovornosti…"
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[var(--slovenia-blue)] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Shranjujem…" : "Shrani besedilo"}
        </button>
        <p className="text-xs text-slate-500">
          Spremembe se prikažejo na vseh straneh tik nad nogo (footer).
        </p>
      </div>
    </form>
  );
}
