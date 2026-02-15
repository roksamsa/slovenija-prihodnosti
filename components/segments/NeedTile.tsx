"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

type Need = {
  id: string;
  title: string;
  description: string | null;
  likesCount?: number;
  dislikesCount?: number;
};

export function NeedTile({ need }: { need: Need }) {
  const [likes, setLikes] = useState(need.likesCount ?? 0);
  const [dislikes, setDislikes] = useState(need.dislikesCount ?? 0);
  const [voting, setVoting] = useState<"like" | "dislike" | null>(null);

  const handleVote = async (value: 1 | -1) => {
    if (voting) return;
    setVoting(value === 1 ? "like" : "dislike");
    try {
      const res = await fetch(`/api/needs/${need.id}/vote`, {
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
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <h4 className="font-medium text-slate-900">{need.title}</h4>
      {need.description && (
        <p className="mt-1 text-sm text-slate-600">{need.description}</p>
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
