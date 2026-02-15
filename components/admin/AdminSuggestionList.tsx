"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Suggestion = {
  id: string;
  title: string;
  description: string;
  authorEmail: string;
  status: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: Date | string;
  segment: { name: string; slug: string };
};

export function AdminSuggestionList({
  pending,
  approved,
  rejected,
}: {
  pending: Suggestion[];
  approved: Suggestion[];
  rejected: Suggestion[];
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setUpdating(null);
    }
  };

  const renderList = (list: Suggestion[], title: string, emptyMsg: string) => (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-semibold text-slate-800">{title}</h2>
      {list.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyMsg}</p>
      ) : (
        <ul className="space-y-4">
          {list.map((s) => (
            <li
              key={s.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs text-slate-500">{s.segment.name}</p>
              <h3 className="mt-1 font-medium text-slate-900">{s.title}</h3>
              {s.description && (
                <p className="mt-1 text-sm text-slate-600">{s.description}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Avtor: {s.authorEmail} · {new Date(s.createdAt as string).toLocaleString("sl-SI")}
                {s.status === "APPROVED" && ` · 👍 ${s.likesCount} 👎 ${s.dislikesCount}`}
              </p>
              {s.status === "PENDING" && (
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(s.id, "APPROVED")}
                    disabled={updating === s.id}
                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {updating === s.id ? "…" : "Odobri"}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(s.id, "REJECTED")}
                    disabled={updating === s.id}
                    className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    Zavrni
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <>
      {renderList(
        pending,
        "Na čakanju",
        "Ni predlogov na čakanju."
      )}
      {renderList(
        approved,
        "Odobreni",
        "Ni odobrenih predlogov."
      )}
      {renderList(
        rejected,
        "Zavrnjeni",
        "Ni zavrnjenih predlogov."
      )}
    </>
  );
}
