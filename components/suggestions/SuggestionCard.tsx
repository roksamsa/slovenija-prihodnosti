"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type Suggestion = {
  id: string;
  title: string;
  description: string;
  authorEmail: string;
  likesCount: number;
  dislikesCount: number;
  segment: { name: string; slug: string };
};

export function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const [likes, setLikes] = useState(suggestion.likesCount);
  const [dislikes, setDislikes] = useState(suggestion.dislikesCount);
  const [voting, setVoting] = useState<"like" | "dislike" | null>(null);

  const handleVote = async (value: 1 | -1) => {
    if (voting) return;
    setVoting(value === 1 ? "like" : "dislike");
    try {
      const res = await fetch(`/api/suggestions/${suggestion.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      if (res.ok && data.likes !== undefined) {
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    } finally {
      setVoting(null);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs text-slate-500">{suggestion.segment.name}</p>
      <h4 className="mt-1 font-medium text-slate-900">{suggestion.title}</h4>
      {suggestion.description && (
        <p className="mt-1 text-sm text-slate-600">{suggestion.description}</p>
      )}
      <div className="mt-3 flex items-center gap-4">
        <button
          type="button"
          onClick={() => handleVote(1)}
          disabled={voting !== null}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          aria-label="Všeč mi je"
        >
          <ThumbsUp className="h-4 w-4" />
          <span>{likes}</span>
        </button>
        <button
          type="button"
          onClick={() => handleVote(-1)}
          disabled={voting !== null}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          aria-label="Ni mi všeč"
        >
          <ThumbsDown className="h-4 w-4" />
          <span>{dislikes}</span>
        </button>
      </div>
    </div>
  );
}
