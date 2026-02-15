"use client";

import { useEffect, useState } from "react";
import { PollChart } from "@/components/charts/PollChart";
import Link from "next/link";

type PartyOption = {
  id: string;
  name: string;
  abbreviation: string;
  slug: string;
  color: string;
};

type ResultItem = {
  id: string;
  percentage: number;
  voteCount: number;
  party: PartyOption & { leaderName: string | null };
};

type PollMe = {
  hasVoted: boolean;
  votedPartySlug: string | null;
  votedPartyName: string | null;
  votedPartyColor: string | null;
};

export function UserPoll() {
  const [results, setResults] = useState<ResultItem[] | null>(null);
  const [me, setMe] = useState<PollMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const fetchResults = () =>
    fetch("/api/poll/results", { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load results");
        return r.json();
      })
      .then((data) => setResults(Array.isArray(data.items) ? data.items : []))
      .catch(() => setResults([]));

  const fetchMe = () =>
    fetch("/api/poll/me", { cache: "no-store" })
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe({ hasVoted: false, votedPartySlug: null, votedPartyName: null, votedPartyColor: null }));

  useEffect(() => {
    Promise.all([fetchResults(), fetchMe()])
      .catch(() => setError("Napaka pri nalaganju."))
      .finally(() => setLoading(false));
  }, []);

  const handleVote = async () => {
    if (!selectedSlug || me?.hasVoted) return;
    setVoting(true);
    setError(null);
    const res = await fetch("/api/poll/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partySlug: selectedSlug }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 409) {
        setError("Iz te naprave ste že glasovali.");
        await fetchMe();
      } else {
        setError(data?.message ?? data?.error ?? "Glasovanje ni uspelo.");
      }
      setVoting(false);
      return;
    }
    await Promise.all([fetchResults(), fetchMe()]);
    setSelectedSlug("");
    setVoting(false);
  };

  if (loading || !results) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">
        Nalaganje …
      </div>
    );
  }

  const totalVotes = results.reduce((s, r) => s + r.voteCount, 0);
  const chartData = results.map((r) => ({
    id: r.id,
    percentage: r.percentage,
    party: {
      name: r.party.name,
      abbreviation: r.party.abbreviation,
      color: r.party.color,
      slug: r.party.slug,
    },
  }));

  return (
    <div className="space-y-6">
      {results.length > 0 && (
        <>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <PollChart data={chartData} />
          </div>

          <p className="text-sm text-slate-500">
            Skupaj glasov: <strong>{totalVotes}</strong>. En glas na napravo (en IP + en brskalnik).
            Družina z več napravami lahko vsak s svoje naprave glasuje.
          </p>

          {/* Summary table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <h2 className="border-b border-slate-200 px-4 py-3 text-lg font-semibold text-slate-900">
          Povzetek glasov
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-700">Stranka</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Kratica</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">Glasovi %</th>
                <th className="px-4 py-3 text-right font-medium text-slate-700">Št. glasov</th>
                <th className="px-4 py-3 text-left font-medium text-slate-700">Akcija</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.party.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <span
                      className="mr-2 inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: row.party.color }}
                    />
                    {row.party.name}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{row.party.abbreviation}</td>
                  <td className="px-4 py-3 text-right font-medium">{row.percentage}%</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.voteCount}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/stranke/${row.party.slug}`}
                      className="text-[var(--slovenia-blue)] hover:underline"
                    >
                      Podrobnosti
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>
        </>
      )}

      {results.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4" role="alert">
          <p className="font-medium text-amber-800">V bazi ni strank.</p>
          <p className="mt-1 text-sm text-amber-700">
            Za polnjenje dropdowna in ankete zaženite seed:{" "}
            <code className="rounded bg-amber-100 px-1.5 py-0.5">npm run db:seed</code>
          </p>
        </div>
      ) : me?.hasVoted ? (
        <div
          className="rounded-xl border border-green-200 bg-green-50 p-4"
          role="status"
        >
          <p className="font-medium text-green-800">
            Vaš glas:{" "}
            <span
              className="font-semibold"
              style={{ color: me.votedPartyColor ?? undefined }}
            >
              {me.votedPartyName}
            </span>
          </p>
          <p className="mt-1 text-sm text-green-700">
            Iz te naprave ne morete glasovati znova. Za podrobnosti o stranki:{" "}
            <Link
              href={`/stranke/${me.votedPartySlug}`}
              className="underline hover:no-underline"
            >
              {me.votedPartyName}
            </Link>
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Glasujte</h3>
          <p className="mb-4 text-sm text-slate-600">
            Izberite stranko in oddajte glas (en glas na napravo).
          </p>
          {error && (
            <p className="mb-3 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex-1 min-w-[200px]">
              <span className="sr-only">Stranka</span>
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
                disabled={voting}
              >
                <option value="">— Izberi stranko —</option>
                {results.map((r) => (
                  <option key={r.party.id} value={r.party.slug}>
                    {r.party.name} ({r.party.abbreviation})
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={handleVote}
              disabled={!selectedSlug || voting}
              className="rounded-lg bg-[var(--slovenia-blue)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {voting ? "Oddajanje …" : "Oddaj glas"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
