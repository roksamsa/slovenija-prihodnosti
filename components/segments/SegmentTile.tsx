"use client";

import { useState } from "react";
import {
  Heart,
  GraduationCap,
  Landmark,
  Users,
  Home,
  ShieldCheck,
  Monitor,
  Scale,
  Leaf,
  Train,
  Baby,
  Shield,
  Briefcase,
  Globe,
  Palette,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SuggestionCard } from "@/components/suggestions/SuggestionCard";

const iconMap: Record<string, LucideIcon> = {
  Heart,
  GraduationCap,
  Landmark,
  Users,
  Home,
  ShieldCheck,
  Monitor,
  Scale,
  Leaf,
  Train,
  Baby,
  Shield,
  Briefcase,
  Globe,
  Palette,
};

type Need = { id: string; title: string; description: string | null; priority: number };
type Suggestion = {
  id: string;
  title: string;
  description: string;
  authorEmail: string;
  likesCount: number;
  dislikesCount: number;
  segment: { name: string; slug: string };
};
type Segment = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  needs: Need[];
};

const tileColors = [
  "bg-blue-50 border-blue-200 hover:bg-blue-100",
  "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
  "bg-amber-50 border-amber-200 hover:bg-amber-100",
  "bg-rose-50 border-rose-200 hover:bg-rose-100",
  "bg-violet-50 border-violet-200 hover:bg-violet-100",
  "bg-cyan-50 border-cyan-200 hover:bg-cyan-100",
  "bg-slate-50 border-slate-200 hover:bg-slate-100",
  "bg-green-50 border-green-200 hover:bg-green-100",
  "bg-orange-50 border-orange-200 hover:bg-orange-100",
  "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
  "bg-teal-50 border-teal-200 hover:bg-teal-100",
  "bg-pink-50 border-pink-200 hover:bg-pink-100",
  "bg-lime-50 border-lime-200 hover:bg-lime-100",
  "bg-sky-50 border-sky-200 hover:bg-sky-100",
  "bg-fuchsia-50 border-fuchsia-200 hover:bg-fuchsia-100",
];

export function SegmentTile({
  segment,
  index,
  suggestions = [],
}: {
  segment: Segment;
  index: number;
  suggestions?: Suggestion[];
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[segment.icon] ?? Heart;
  const colorClass = tileColors[index % tileColors.length];

  return (
    <div
      className={cn(
        "rounded-xl border p-5 transition-colors cursor-pointer",
        colorClass
      )}
      onClick={() => setExpanded(!expanded)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-700">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">{segment.name}</h3>
          {segment.description && (
            <p className="mt-1 text-sm text-slate-600 line-clamp-2">
              {segment.description}
            </p>
          )}
          <p className="mt-2 text-xs text-slate-500">
            {segment.needs.length + suggestions.length} potreb / predlogov
          </p>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-slate-200/80 pt-4">
          <h4 className="mb-3 text-sm font-semibold text-slate-800">
            Potrebe in predlogi
          </h4>
          <ul className="space-y-3">
            {segment.needs.map((need) => (
              <li key={need.id} className="text-sm">
                <span className="font-medium text-slate-800">{need.title}</span>
                {need.description && (
                  <p className="mt-0.5 text-slate-600">{need.description}</p>
                )}
              </li>
            ))}
          </ul>
          {suggestions.length > 0 && (
            <>
              <h4 className="mt-4 mb-2 text-sm font-semibold text-slate-800">
                Predlogi obiskovalcev
              </h4>
              <div className="space-y-2">
                {suggestions.map((s) => (
                  <SuggestionCard key={s.id} suggestion={s} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
