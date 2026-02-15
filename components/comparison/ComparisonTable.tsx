"use client";

import { useMemo, useState, Fragment } from "react";
import Link from "next/link";
import { Check, X, HelpCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Party = {
  id: string;
  slug: string;
  abbreviation: string;
  name: string;
  color: string;
  programUrl: string | null;
};
type Stance = { value: boolean | null; partyId: string };
type Policy = {
  id: string;
  category: string;
  question: string;
  orderIndex: number;
  stances: (Stance & { party: Party })[];
};
type Props = {
  policies: Policy[];
  parties: Party[];
  categories: string[];
};

const categoryColors: Record<string, string> = {
  "Zunanja politika": "bg-blue-50 border-blue-200",
  "Socialna politika": "bg-rose-50 border-rose-200",
  Gospodarstvo: "bg-amber-50 border-amber-200",
  Zdravstvo: "bg-emerald-50 border-emerald-200",
  Šolstvo: "bg-violet-50 border-violet-200",
  Okolje: "bg-green-50 border-green-200",
  "Digitalizacija in transparentnost": "bg-cyan-50 border-cyan-200",
  Pravosodje: "bg-slate-100 border-slate-200",
  "Demografija in mladi": "bg-pink-50 border-pink-200",
  "Varnost in obramba": "bg-red-50 border-red-200",
  "Kultura in šport": "bg-orange-50 border-orange-200",
};

function getCategoryStyle(cat: string) {
  return categoryColors[cat] ?? "bg-slate-50 border-slate-200";
}

export function ComparisonTable({ policies, parties, categories }: Props) {
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = policies;
    if (categoryFilter)
      list = list.filter((p) => p.category === categoryFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.question.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [policies, categoryFilter, search]);

  const stanceByParty = (policy: Policy, partyId: string): boolean | null => {
    const s = policy.stances.find((st) => st.partyId === partyId);
    return s?.value ?? null;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Išči po temah..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none focus:ring-1 focus:ring-[var(--slovenia-blue)]"
            aria-label="Išči izjave"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[var(--slovenia-blue)] focus:outline-none"
          aria-label="Filter po kategoriji"
        >
          <option value="">Vse kategorije</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-600">
        Prikazanih {filtered.length} izjav. Prvi stolpec je pritrjen ob
        vodoravnem pomiku.
      </p>

      {/* Table wrapper: horizontal + vertical scroll */}
      <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm max-h-[70vh]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 sticky top-0 z-11">
              <th className="sticky-col min-w-[280px] max-w-[320px] border-b border-r border-slate-200 px-4 py-3 text-left font-semibold text-slate-800">
                Izjava / tema
              </th>
              {parties.map((party) => (
                <th
                  key={party.id}
                  className="min-w-[88px] border-b border-slate-200 px-2 py-3 text-center font-medium text-slate-700"
                >
                  <Link
                    href={`/stranke/${party.slug}`}
                    className="block hover:underline"
                  >
                    <span
                      className="mb-1 inline-block h-2 w-8 rounded"
                      style={{ backgroundColor: party.color }}
                    />
                    <span className="block font-semibold">
                      {party.abbreviation}
                    </span>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((policy, idx) => {
              const isCategoryHeader =
                idx === 0 || filtered[idx - 1].category !== policy.category;
              return (
                <Fragment key={policy.id}>
                  {isCategoryHeader && (
                    <tr
                      key={`cat-${policy.category}`}
                      className={getCategoryStyle(policy.category)}
                    >
                      <td
                        colSpan={parties.length + 1}
                        className="border-b border-slate-200 bg-inherit px-4 py-2"
                      >
                        <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {policy.category}
                        </span>
                      </td>
                    </tr>
                  )}
                  <tr
                    key={policy.id}
                    className={cn(
                      "border-b border-slate-100 hover:bg-slate-50/80",
                      getCategoryStyle(policy.category),
                    )}
                  >
                    <td className="sticky-col border-r border-slate-200 bg-inherit px-4 py-2 align-top">
                      <span className="block">{policy.question}</span>
                    </td>
                    {parties.map((party) => {
                      const value = stanceByParty(policy, party.id);
                      return (
                        <td
                          key={party.id}
                          className="min-w-[88px] border-slate-100 px-2 py-2 text-center align-top"
                        >
                          {value === true && (
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700"
                              title="Podpira"
                            >
                              <Check className="h-5 w-5" aria-hidden />
                            </span>
                          )}
                          {value === false && (
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700"
                              title="Ne podpira"
                            >
                              <X className="h-5 w-5" aria-hidden />
                            </span>
                          )}
                          {value === null && (
                            <span
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                              title="Ni podatka"
                            >
                              <HelpCircle className="h-5 w-5" aria-hidden />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700">
            <Check className="h-3 w-3" />
          </span>
          Podpira
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-700">
            <X className="h-3 w-3" />
          </span>
          Ne podpira
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <HelpCircle className="h-3 w-3" />
          </span>
          Ni podatka
        </span>
      </div>
    </div>
  );
}
