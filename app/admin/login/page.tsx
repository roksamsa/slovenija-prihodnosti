"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Prijava ni uspela.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Prišlo je do napake.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Admin prijava</h1>
      <p className="mb-6 text-sm text-slate-600">
        Vpišite geslo za odobritev predlogov na strani Kaj potrebujemo.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {error}
          </p>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Geslo</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--slovenia-blue)] py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Prijava …" : "Prijava"}
        </button>
      </form>
      <p className="mt-6 text-center">
        <Link href="/" className="text-sm text-slate-500 hover:underline">
          Nazaj na domačo stran
        </Link>
      </p>
    </div>
  );
}
