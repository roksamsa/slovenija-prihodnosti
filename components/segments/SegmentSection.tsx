"use client";

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
import { NeedTile } from "./NeedTile";
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

const categoryColors = [
  "bg-blue-100 border-blue-300 text-blue-900",
  "bg-emerald-100 border-emerald-300 text-emerald-900",
  "bg-amber-100 border-amber-300 text-amber-900",
  "bg-rose-100 border-rose-300 text-rose-900",
  "bg-violet-100 border-violet-300 text-violet-900",
  "bg-cyan-100 border-cyan-300 text-cyan-900",
  "bg-slate-100 border-slate-300 text-slate-800",
  "bg-green-100 border-green-300 text-green-900",
  "bg-orange-100 border-orange-300 text-orange-900",
  "bg-indigo-100 border-indigo-300 text-indigo-900",
  "bg-teal-100 border-teal-300 text-teal-900",
  "bg-pink-100 border-pink-300 text-pink-900",
  "bg-lime-100 border-lime-300 text-lime-900",
  "bg-sky-100 border-sky-300 text-sky-900",
  "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-900",
];

type Need = {
  id: string;
  title: string;
  description: string | null;
  priority: number;
  likesCount?: number;
  dislikesCount?: number;
};
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

export function SegmentSection({
  segment,
  index,
  suggestions = [],
}: {
  segment: Segment;
  index: number;
  suggestions?: Suggestion[];
}) {
  const Icon = iconMap[segment.icon] ?? Heart;
  const headerClass = categoryColors[index % categoryColors.length];
  const hasContent = segment.needs.length > 0 || suggestions.length > 0;

  return (
    <section className="mb-10 container mx-auto max-w-7xl px-4 sm:px-6">
      {/* Category header – sticky below main nav when scrolling */}
      <div
        className={cn(
          "sticky top-16 z-10 flex w-full items-center gap-4 rounded-lg border py-4 px-4 shadow-sm",
          headerClass
        )}
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-700 shadow-sm">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold tracking-tight">{segment.name}</h2>
          {segment.description && (
            <p className="mt-0.5 text-sm opacity-90">{segment.description}</p>
          )}
        </div>
      </div>

      {/* Tiles grid below category */}
      {hasContent && (
        <div className="py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {segment.needs.map((need) => (
              <NeedTile key={need.id} need={need} />
            ))}
            {suggestions.map((s) => (
              <SuggestionCard key={s.id} suggestion={s} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
