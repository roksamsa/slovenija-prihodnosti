"use client";

import { useState } from "react";

export default function PlatformaPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="mb-4 text-3xl font-bold text-slate-900">Platforma</h1>
      <p className="mb-8 text-lg text-slate-600">
        Ta stran je v pripravi. Kmalu bo na voljo več informacij.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
        <p className="mb-4 text-sm text-slate-600">
          Prijavite se na e-pošto, da vas obvestimo o novostih (obvestila še niso aktivna).
        </p>
        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vaš@email.si"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
              aria-label="E-pošta"
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--slovenia-blue)] px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Prijavi se
            </button>
          </form>
        ) : (
          <p className="text-sm text-green-700">
            Hvala! Ko bo storitev aktivna, vas bomo obvestili.
          </p>
        )}
      </div>
      <div className="mt-12 flex justify-center">
        <div className="h-24 w-24 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400" aria-hidden>
          <span className="text-4xl">🚧</span>
        </div>
      </div>
    </div>
  );
}
