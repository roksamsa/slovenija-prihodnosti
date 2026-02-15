"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Link from "next/link";

type PollItem = {
  id: string;
  percentage: number;
  party: { name: string; abbreviation: string; color: string; slug: string };
};

export function PollChart({ data }: { data: PollItem[] }) {
  const chartData = data.map((d) => ({
    name: d.party.abbreviation,
    fullName: d.party.name,
    percentage: d.percentage,
    slug: d.party.slug,
    color: d.party.color,
  }));

  const maxPct = Math.max(100, ...chartData.map((d) => d.percentage), 1);

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 60, bottom: 8 }}
        >
          <XAxis type="number" domain={[0, maxPct]} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="name" width={56} tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload;
              return (
                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
                  <p className="font-medium text-slate-900">{p.fullName}</p>
                  <p className="text-lg font-semibold" style={{ color: p.color }}>
                    {p.percentage}%
                  </p>
                  <Link
                    href={`/stranke/${p.slug}`}
                    className="mt-1 text-sm text-[var(--slovenia-blue)] hover:underline"
                  >
                    Ogled stranke →
                  </Link>
                </div>
              );
            }}
          />
          <Bar dataKey="percentage" radius={[0, 4, 4, 0]} isAnimationActive>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
